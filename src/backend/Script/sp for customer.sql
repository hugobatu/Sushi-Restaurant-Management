GO
USE SushiXRestaurant

-- 1. khách hàng tra cứu thông tin về điểm thưởng
GO
CREATE OR ALTER PROC sp_view_customer_points
    @phone_number VARCHAR(10) -- Số điện thoại của khách hàng
AS
BEGIN
    BEGIN TRY
        SELECT 
            C.customer_name,
            C.phone_number,
            M.card_id,
            ML.level_name,
            M.points,
            M.membership_status,
            M.issued_date,
            M.valid_until
        FROM Customer C
        JOIN Membership M ON C.customer_id = M.customer_id
        JOIN MembershipLevel ML ON M.level_id = ML.level_id
        WHERE C.phone_number = @phone_number
          AND M.membership_status = 'active'; -- Chỉ hiển thị thẻ đang hoạt động

        -- Nếu không tìm thấy kết quả
        IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('No active membership found for the provided phone number.', 16, 1);
        END;
    END TRY
    BEGIN CATCH
        -- Xử lý lỗi
        DECLARE @error_message NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @error_severity INT = ERROR_SEVERITY();
        DECLARE @error_state INT = ERROR_STATE();

        RAISERROR (@error_message, @error_severity, @error_state);
    END CATCH
END;
GO

-- 2. khách hàng đặt trước chỗ hoặc đặt giao hàng (phải tạo tài khoản đăng nhập mới đặt chỗ được)
GO
CREATE OR ALTER PROC sp_reserve_and_delivery_order_by_customer
    @user_id INT, -- id của khách hàng
    @branch_id VARCHAR(10), -- chi nhánh lựa chọn
    @type NVARCHAR(20), -- 'delivery' hoặc 'reserve'
    @datetime DATETIME, -- ngày giờ ăn (hoặc giao hàng)
    @address NVARCHAR(255) = NULL, -- địa chỉ giao hàng (chỉ dùng cho delivery)
    @num_guests INT = NULL, -- số khách (chỉ dùng cho reserve)
    @items_json NVARCHAR(MAX) -- Chuỗi JSON chứa danh sách món ăn
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN;

        -- 1. kiểm tra sự tồn tại của khách hàng
        IF NOT EXISTS (
            SELECT 1
            FROM Customer C
            WHERE C.customer_id = @user_id
        )
        BEGIN
            RAISERROR('This customer has no data, please ask them to get data, then input in database.', 16, 1);
        END;

        -- 1.2 Parse JSON input and check items
        DECLARE @items TABLE (
            item_id VARCHAR(10), 
            quantity INT
        );

        -- phân tích JSON thành bảng
        INSERT INTO @items (item_id, quantity)
        SELECT item_id, quantity
        FROM OPENJSON(@items_json)
        WITH (
            item_id VARCHAR(10) '$.item_id',
            quantity INT '$.quantity'
        );

        -- 2. kiểm tra xem các món trong item_ids có tồn tại ở chi nhánh này không
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
        END;

        -- 3. tạo đơn hàng trong bảng Order
        DECLARE @order_id INT;

        INSERT INTO [Order] (customer_id, branch_id, staff_id, order_datetime, order_status)
        VALUES (@user_id, @branch_id, @user_id, GETDATE(), N'pending');

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

        -- 5. Xử lý loại đơn hàng: reserve hoặc delivery
        IF @type = N'reserve'
        BEGIN
            -- Kiểm tra đầu vào cho đơn đặt trước
            IF @num_guests IS NULL
            BEGIN
                RAISERROR('Number of guests is required for reservation orders.', 16, 1);
            END;

            -- Thêm đơn đặt trước vào bảng ReservationOrder
            INSERT INTO ReservationOrder (order_id, reservation_datetime, num_guests, reservation_order_status)
            VALUES (@order_id, @datetime, @num_guests, N'pending');
        END
        ELSE IF @type = N'delivery'
        BEGIN
            -- Kiểm tra đầu vào cho đơn giao hàng
            IF @address IS NULL
            BEGIN
                RAISERROR('Delivery address is required for delivery orders.', 16, 1);
            END;

            -- Thêm đơn giao hàng vào bảng DeliveryOrder
            INSERT INTO DeliveryOrder (order_id, delivery_address, delivery_fee, delivery_order_status)
            VALUES (@order_id, @address, 20000, N'pending');
        END
        ELSE
        BEGIN
            -- Nếu loại đơn hàng không hợp lệ
            RAISERROR('Invalid order type. Must be "reserve" or "delivery".', 16, 1);
        END;

        -- Commit transaction
        COMMIT TRAN;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        -- Raise error for debugging
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END;
GO