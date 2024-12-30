GO
USE SushiXRestaurant

/*update membership của khách hàng*/
GO
CREATE OR ALTER PROC sp_update_membership_level
    @customer_id INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Calculate total spending in the past year
        DECLARE @total_spending FLOAT = (
            SELECT SUM(B.subtotal)
            FROM Bill B
			JOIN [Order] O
			ON O.order_id = B.order_id
            WHERE O.customer_id = @customer_id 
              AND B.bill_date >= DATEADD(YEAR, -1, GETDATE())
        );

        -- Retrieve current membership level
        DECLARE @current_level_id INT;
        SELECT @current_level_id = level_id
        FROM Membership
        WHERE customer_id = @customer_id;

        -- Determine the new membership level
        DECLARE @new_level_id INT;
        IF @total_spending >= 10000000 -- 10,000,000 VND
        BEGIN
            SELECT @new_level_id = level_id
            FROM MembershipLevel
            WHERE level_name = N'gold';
        END
        ELSE IF @total_spending >= 5000000 -- 5,000,000 VND
        BEGIN
            SELECT @new_level_id = level_id
            FROM MembershipLevel
            WHERE level_name = N'silver';
        END
        ELSE
        BEGIN
            SELECT @new_level_id = level_id
            FROM MembershipLevel
            WHERE level_name = N'membership';
        END;

        -- Update membership level if it has changed
        IF @new_level_id <> @current_level_id
        BEGIN
            UPDATE Membership
            SET level_id = @new_level_id,
                issued_date = GETDATE(),
                valid_until = DATEADD(YEAR, 1, GETDATE()),
                points = 0 -- Reset points for the new level
            WHERE customer_id = @customer_id;
        END;

        COMMIT TRANSACTION;

        PRINT 'Membership level updated successfully.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

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
        BEGIN TRANSACTION;

        -- Check if the customer already exists
        IF EXISTS (
            SELECT 1
            FROM Customer
            WHERE customer_name = @customer_name 
               OR email = @email 
               OR id_number = @id_number
        )
        BEGIN
            RAISERROR('This customer already exists.', 16, 1);
        END;

        -- Insert the new customer into the Customer table
        INSERT INTO Customer (customer_name, email, phone_number, gender, birth_date, id_number)
        VALUES (@customer_name, @email, @phone_number, @gender, @birth_date, @id_number);

        DECLARE @new_customer_id INT = SCOPE_IDENTITY();

        -- Retrieve the Membership level_id for the "Membership" level
        DECLARE @membership_level_id INT;
        SELECT @membership_level_id = level_id
        FROM MembershipLevel
        WHERE level_name = N'membership';

        -- Insert a new Membership record for the customer
        INSERT INTO Membership (level_id, customer_id, issued_date, valid_until, points, membership_status)
        VALUES (
            @membership_level_id,
            @new_customer_id,
            GETDATE(),
            DATEADD(YEAR, 1, GETDATE()), -- Valid for 1 year from today
            0, -- New customers start with 0 points
            N'active' -- Membership is active
        );

        COMMIT TRANSACTION;

        PRINT 'Customer added successfully with customer_id = ' + CAST(@new_customer_id AS NVARCHAR);
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
-- 2. xem danh sách các đơn hàng do nhân viên đó phụ trách và các đơn hàng đặt mang đi hoặc đặt trước tại chi nhánh
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
	WHERE (O.branch_id = @branch_id  AND S.staff_id = @user_id AND O.order_status = @order_status)
    OR ((DO.order_id IS NOT NULL OR RO.order_id IS NOT NULL) AND O.order_status = @order_status);
END
GO
EXEC sp_view_order_by_userid 1
SELECT * FROM [Order] WHERE order_status = 'PENDING'
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
-- 4. xác nhận order và xuẩt ra bill cho dịch vụ trực tiếp
GO
CREATE OR ALTER PROC sp_confirm_direct_service_order
    @user_id INT,
    @order_id INT,
    @vat FLOAT = 0.08, -- default VAT is 8%
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

        -- Fetch branch_id
        DECLARE @branch_id VARCHAR(10);
        SET @branch_id = (
            SELECT B.branch_id
            FROM Branch B
            JOIN Department D ON D.branch_id = B.branch_id
            JOIN Staff S ON S.department_id = D.department_id
            WHERE S.staff_id = @user_id
        );

        IF @branch_id IS NULL
        BEGIN
            RAISERROR('User does not belong to any branch.', 16, 1);
        END;

        -- Fetch customer_id and membership level
        DECLARE @customer_id INT, @membership_level_id INT, @discount_percentage FLOAT;
        SELECT @customer_id = O.customer_id, @membership_level_id = M.level_id
        FROM [Order] O
        LEFT JOIN Membership M ON M.customer_id = O.customer_id
        WHERE O.order_id = @order_id AND O.order_status = 'pending';

        IF @customer_id IS NULL
        BEGIN
            RAISERROR('Invalid order ID or this order ID has been processed.', 16, 1);
        END;

        -- Fetch discount percentage based on membership level
        SET @discount_percentage = ISNULL(
            (SELECT discount_percentage FROM MembershipLevel WHERE level_id = @membership_level_id),
            0
        );

        -- Calculate total amount with VAT and discount
        DECLARE @total_amount FLOAT, @discount_amount FLOAT;
        SET @total_amount = (
            SELECT SUM(OD.quantity * OD.unit_price)
            FROM OrderDetails OD
            WHERE OD.order_id = @order_id
        );

        IF @total_amount IS NULL OR @total_amount <= 0
        BEGIN
            RAISERROR('No items found in the order.', 16, 1);
        END;

        SET @discount_amount = @total_amount * @discount_percentage / 100;
        SET @total_amount = (@total_amount - @discount_amount) * (1 + @vat);

        -- Insert into Bill table
        DECLARE @BillOutput TABLE (bill_id VARCHAR(10));
        INSERT INTO Bill (
			bill_id, 
			order_id, 
			subtotal, 
			discount_amount, 
			tax_amount, 
			payment_method, 
			bill_date, 
			bill_status)
        OUTPUT inserted.bill_id INTO @BillOutput
        VALUES (
			CONVERT(VARCHAR(10), LEFT(NEWID(), 10)), 
			@order_id, 
			@total_amount, 
			@discount_amount, 
			@vat, 
			'cash', 
			GETDATE(), 
			'paid');

        DECLARE @bill_id VARCHAR(10);
        SELECT TOP 1 @bill_id = bill_id FROM @BillOutput;

        -- Insert into CustomerRating table
        INSERT INTO CustomerRating (
			customer_id, 
			branch_id, 
			bill_id, 
			staff_id, 
			service_manner_rating, 
			branch_rating, 
			food_quality_rating, 
			price_rating, 
			surroundings_rating, 
			personal_response)
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

        -- Update order status
        UPDATE [Order]
        SET order_status = 'done'
        WHERE order_id = @order_id;

        -- Update customer's points and spending
        UPDATE Membership
        SET points = points + FLOOR(@total_amount / 100000) -- 1 point per 100,000 VND spent
        WHERE customer_id = @customer_id;

        -- Update membership level based on conditions
        EXEC sp_update_membership_level @customer_id;

        -- Return bill details
        SELECT * FROM Bill WHERE bill_id = @bill_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @error_message NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @error_severity INT = ERROR_SEVERITY();
        DECLARE @error_state INT = ERROR_STATE();

        RAISERROR(@error_message, @error_severity, @error_state);
    END CATCH
END;
GO
-- 4.2 xác nhận order cho dịch vụ đem đi giao và dịch vụ
GO
CREATE OR ALTER PROC sp_confirm_reserve_and_delivery_order
    @order_id INT,
    @vat FLOAT = 0.08 -- Default VAT is 8%
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Fetch branch_id and customer_id
        DECLARE @branch_id VARCHAR(10), @customer_id INT, @membership_level_id INT, @discount_percentage FLOAT;
        SELECT @branch_id = O.branch_id, @customer_id = O.customer_id, @membership_level_id = M.level_id
        FROM [Order] O
        LEFT JOIN Membership M ON M.customer_id = O.customer_id
        WHERE O.order_id = @order_id AND O.order_status = 'pending';

        IF @customer_id IS NULL
        BEGIN
            RAISERROR('Invalid order ID or this order has already been processed.', 16, 1);
        END;

        -- Fetch discount percentage based on membership level
        SET @discount_percentage = ISNULL(
            (SELECT discount_percentage FROM MembershipLevel WHERE level_id = @membership_level_id),
            0
        );

        -- Calculate total amount with VAT and discount
        DECLARE @total_amount FLOAT, @discount_amount FLOAT;
		SET @total_amount = ISNULL((
			SELECT SUM(OD.quantity * OD.unit_price)
			FROM OrderDetails OD
			WHERE OD.order_id = @order_id
		), 0);
		SET @total_amount = @total_amount + ISNULL((
			SELECT DO.delivery_fee
			FROM DeliveryOrder DO
			WHERE DO.order_id = @order_id
		), 0);
        IF @total_amount IS NULL OR @total_amount <= 0
        BEGIN
            RAISERROR('No items found in the order.', 16, 1);
        END;

        SET @discount_amount = @total_amount * @discount_percentage / 100;
        SET @total_amount = (@total_amount - @discount_amount) * (1 + @vat);
		PRINT(@total_amount)
        -- Insert into Bill table
        DECLARE @BillOutput TABLE (bill_id VARCHAR(10));
        INSERT INTO Bill (
			bill_id, 
			order_id, 
			subtotal,
			discount_amount, 
			tax_amount, 
			payment_method, 
			bill_date,
			bill_status)
        OUTPUT inserted.bill_id INTO @BillOutput
        VALUES (
			CONVERT(VARCHAR(10), LEFT(NEWID(), 10)), 
			@order_id, 
			@total_amount, 
			@discount_amount, 
			@vat, 
			'cash', 
			GETDATE(),
			'paid');

        DECLARE @bill_id VARCHAR(10);
        SELECT TOP 1 @bill_id = bill_id FROM @BillOutput;

        -- Update order status
        UPDATE [Order]
        SET order_status = 'done'
        WHERE order_id = @order_id;

        -- Update customer's points and spending
        UPDATE Membership
        SET points = points + FLOOR(@total_amount / 100000) -- 1 point per 100,000 VND spent
        WHERE customer_id = @customer_id;

        -- Update membership level based on conditions
        EXEC sp_update_membership_level @customer_id;

        -- Return bill details
        SELECT * FROM Bill WHERE bill_id = @bill_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @error_message NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @error_severity INT = ERROR_SEVERITY();
        DECLARE @error_state INT = ERROR_STATE();

        RAISERROR(@error_message, @error_severity, @error_state);
    END CATCH
END;
-- 5. xóa order
GO
CREATE OR ALTER PROC sp_delete_order
    @order_id INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Check if the order exists and has a 'pending' status
        IF NOT EXISTS (
            SELECT 1
            FROM [Order] O
            WHERE O.order_id = @order_id AND O.order_status = 'pending'
        )
        BEGIN
            RAISERROR('This order ID does not exist or is not in a pending status.', 16, 1);
        END

        -- Update the order status to 'cancelled'
        UPDATE [Order]
        SET order_status = 'cancelled'
        WHERE order_id = @order_id;

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


--SELECT * FROM [Order]
--SELECT * FROM OrderDetails
--SELECT * FROM DirectServiceOrder
 SELECT * FROM DeliveryOrder
 SELECT * FROM ReservationOrder
--SELECT * FROM Bill

/*
EXEC sp_confirm_direct_service_order 1, 1, 0.08, 10, 10, 10, 10, 10, N'Nhà hàng đỉnh của chóp'
exec sp_view_order_by_userid 1
UPDATE [Order]
SET order_status = 'pending'
where order_id = 1
*/


SELECT * FROM MenuItem

EXEC sp_confirm_reserve_and_delivery_order 6