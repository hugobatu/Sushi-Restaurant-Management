GO
USE SushiXRestaurant

-- 1. thêm khách hàng
GO
CREATE OR ALTER PROC sp_add_customer_info
	@customer_name NVARCHAR(50),
	@email VARCHAR(50),
	@phone_number VARCHAR(10),
	@gender NVARCHAR(10),
	@birth_date DATE,
	@id_number VARCHAR(12)
AS
BEGIN
	BEGIN TRY
		BEGIN TRAN
		IF EXISTS (
			SELECT 1
			FROM Customer
			WHERE customer_name = @customer_name OR email = @email OR id_number = @id_number
		)
		BEGIN
			RAISERROR('This customer has existed', 16, 1)
		END

		INSERT INTO Customer(customer_name, email, phone_number, gender, birth_date, id_number)
		VALUES (@customer_name, @email, @phone_number, @gender, @birth_date, @id_number)
        DECLARE @new_customer_id INT = SCOPE_IDENTITY();

		COMMIT TRAN
		PRINT 'Add new customer successfully with' + CAST(@new_customer_id AS NVARCHAR)
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRAN
		
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH
END
GO
-- 2. xem danh sách các đơn hàng do nhân viên đó phụ trách
GO
CREATE OR ALTER PROC sp_view_order_by_userid
    @user_id INT,
    @order_status NVARCHAR(20) = 'pending'
AS
BEGIN
    -- lấy branch_id của nhân viên
    DECLARE @branch_id VARCHAR(10);
    SET @branch_id = (
        SELECT B.branch_id
        FROM Branch B
        JOIN Department D ON D.branch_id = B.branch_id
        JOIN Staff S ON S.department_id = D.department_id
        WHERE S.staff_id = @user_id
    );

    -- lấy danh sách các đơn hàng
    SELECT 
        O.order_id,
        O.order_datetime,
        O.order_status,
        C.customer_name,
        C.phone_number,
        CASE 
            WHEN DSO.order_id IS NOT NULL THEN 'Direct Service Order'
            WHEN DO.order_id IS NOT NULL THEN 'Delivery Order' 
            WHEN RO.order_id IS NOT NULL THEN 'Reservation Order'
        END AS order_type
    FROM [Order] O
    LEFT JOIN Customer C 
	ON C.customer_id = O.customer_id
	LEFT JOIN Staff S
	ON S.staff_id = O.staff_id
    LEFT JOIN DirectServiceOrder DSO 
	ON DSO.order_id = O.order_id
    LEFT JOIN DeliveryOrder DO 
	ON DO.order_id = O.order_id
    LEFT JOIN ReservationOrder RO 
	ON RO.order_id = O.order_id
    WHERE (
		O.branch_id = @branch_id AND S.staff_id = @user_id) -- Đơn hàng nhân viên phụ trách
        OR (DO.order_id IS NOT NULL OR RO.order_id IS NOT NULL) -- Đơn hàng online hoặc đặt trước
        AND (@order_status IS NULL OR O.order_status = @order_status); -- Lọc theo trạng thái nếu cần
END
-- 2. xác nhận order và xuẩt ra bill
GO
CREATE OR ALTER PROC sp_confirm_order_export_bill_get_rating
    @user_id INT,
    @order_id INT,
    @vat FLOAT = 0.08, -- default VAT là 8%
    -- Đánh giá của khách hàng
    @servile_manner_rating INT,
    @branch_rating INT,
    @food_quality_rating INT,
    @price_rating INT,
    @surroundings_rating INT,
    @personal_response NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- lấy branch_id
        DECLARE @branch_id VARCHAR(10);
        SET @branch_id = (
            SELECT B.branch_id
            FROM Branch B
            JOIN Department D ON D.branch_id = B.branch_id
            JOIN Staff S ON S.department_id = D.department_id
            WHERE S.staff_id = @user_id
        );

        -- kiểm tra nếu branch_id không hợp lệ
        IF @branch_id IS NULL
        BEGIN
            RAISERROR('User does not belong to any branch.', 16, 1)
        END;

        -- lấy customer_id từ order
        DECLARE @customer_id INT;
        SET @customer_id = (
            SELECT O.customer_id
            FROM [Order] O
            WHERE O.order_id = @order_id AND O.order_status = 'pending'
        );

        -- kiểm tra nếu order_id không hợp lệ
        IF @customer_id IS NULL
        BEGIN
            RAISERROR('Invalid order ID or this order ID has been processed and exported to bill.', 16, 1)
        END;

        -- tính tổng tiền món ăn trong đơn hàng
        DECLARE @total_amount FLOAT;
        SET @total_amount = (
            SELECT SUM(OD.quantity * OD.unit_price) * (1 + @vat)
            FROM OrderDetails OD
            WHERE OD.order_id = @order_id
        );
		PRINT(@total_amount)
        -- kiểm tra nếu không có món ăn nào trong order
        IF @total_amount IS NULL OR @total_amount <= 0
        BEGIN
            RAISERROR('No items found in the order.', 16, 1);
        END;

        -- insert dữ liệu vào bảng Bill
        DECLARE @BillOutput TABLE (
			bill_id VARCHAR(10)
		);

		INSERT INTO Bill(bill_id, order_id, subtotal, discount_amount, tax_amount, payment_method, bill_date, bill_status)
		OUTPUT inserted.bill_id INTO @BillOutput
		VALUES (CONVERT(VARCHAR(10), LEFT(NEWID(), 10)), @order_id, @total_amount, 0, @vat, 'cash', GETDATE(), 'paid');
		
		DECLARE @bill_id VARCHAR(10);
        SELECT TOP 1 @bill_id = bill_id FROM @BillOutput;

        -- insert đánh giá khách hàng vào bảng CustomerRating
        INSERT INTO CustomerRating(
			customer_id, 
			branch_id, 
			bill_id, 
			staff_id,
			service_manner_rating,
			branch_rating,
			food_quality_rating,
			price_rating,
			surroundings_rating,
			personal_response
		)
        VALUES (
			@customer_id, 
			@branch_id,
			@bill_id,
			@user_id,
			@servile_manner_rating, 
			@branch_rating,
			@food_quality_rating, 
			@price_rating, 
			@surroundings_rating,
			@personal_response);

        -- cập nhật trạng thái của order thành "confirmed"
        UPDATE [Order]
        SET order_status = 'done'
        WHERE order_id = @order_id;

		SELECT *
		FROM Bill B
		WHERE B.bill_id = @bill_id
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;

        DECLARE @error_message NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @error_severity INT = ERROR_SEVERITY();
        DECLARE @error_state INT = ERROR_STATE();

        RAISERROR (@error_message, @error_severity, @error_state);
    END CATCH
END;
GO
-- 3. nhân viên tạo order cho khách hàng dùng dịch vụ ĂN TRỰC TIẾP
GO
CREATE OR ALTER PROC sp_create_order_by_staff
    @user_id INT, -- ID của nhân viên tạo order
    @customer_name NVARCHAR(50),
    @phone_number VARCHAR(10),
    @table_id INT, -- ID bàn
    @items_json NVARCHAR(MAX) -- Chuỗi JSON chứa danh sách món ăn
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN

        -- 1. Kiểm tra hoặc thêm khách hàng
        DECLARE @customer_id INT;

        SELECT @customer_id = customer_id
        FROM Customer
        WHERE phone_number = @phone_number AND customer_name = @customer_name;

        IF @customer_id IS NULL
        BEGIN
            RAISERROR('This customer has no data, please ask them to get data, then input in database.', 16, 1);
        END

        -- 1.1 Lấy id chi nhánh mà nhân viên tạo đơn đang hoạt động
        DECLARE @branch_id VARCHAR(10)
        SELECT @branch_id = B.branch_id
        FROM Branch B
        JOIN Department D ON D.branch_id = B.branch_id
        JOIN Staff S ON S.department_id = D.department_id
        WHERE S.staff_id = @user_id

        -- 1.2 Parse JSON input and check items
        DECLARE @items TABLE (
			item_id VARCHAR(10), 
			quantity INT
		);

        -- Phân tích JSON thành bảng
        INSERT INTO @items (item_id, quantity)
        SELECT item_id, quantity
        FROM OPENJSON(@items_json)
        WITH (
            item_id VARCHAR(10) '$.item_id',  -- Lấy item_id từ JSON
            quantity INT '$.quantity'          -- Lấy quantity từ JSON
        );

        -- 2. Kiểm tra xem các món trong item_ids có tồn tại ở chi nhánh này không
        IF EXISTS (
            SELECT 1
            FROM @items AS ItemList
            WHERE NOT EXISTS (
                SELECT 1
                FROM BranchMenuItem BMI
                WHERE BMI.item_id = ItemList.item_id
                AND BMI.is_available = 1
                AND BMI.branch_id = @branch_id
            )
        )
        BEGIN
            RAISERROR('This item is not available in this branch', 16, 1);
        END

        -- 3. Tạo đơn hàng
        DECLARE @order_id INT;

        INSERT INTO [Order] (customer_id, branch_id, staff_id, order_datetime, order_status)
        VALUES (@customer_id, @branch_id, @user_id, GETDATE(), N'pending');

        SET @order_id = SCOPE_IDENTITY();
        
        -- 4. Thêm vào chi tiết đơn hàng
        INSERT INTO OrderDetails (order_id, item_id, quantity, unit_price)
        SELECT 
            @order_id, 
            ItemList.item_id, 
            ItemList.quantity, 
            MenuItem.base_price
        FROM @items AS ItemList
        JOIN MenuItem ON MenuItem.item_id = ItemList.item_id;

        -- 5. Thêm vào bảng DirectServiceOrder
        INSERT INTO DirectServiceOrder (order_id, table_id)
        VALUES (@order_id, @table_id);
        
        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
-- 4. 
--SELECT * FROM [Order]
--SELECT * FROM OrderDetails
--SELECT * FROM DirectServiceOrder
--SELECT * FROM Bill

--EXEC sp_confirm_order_export_bill_get_rating 1, 25, 0.08, 10, 10, 10, 10, 10, N'Nhà hàng đỉnh của chóp'

--UPDATE [Order]
--SET order_status = 'pending'
--where order_id = 25
--DELETE FROM OrderDetails
--DELETE FROM DirectServiceOrder
--DELETE FROM [Order]