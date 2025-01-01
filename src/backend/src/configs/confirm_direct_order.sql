GO
USE SushiXRestaurant

GO
CREATE OR ALTER PROC sp_confirm_orders_for_staff_batch
    @user_id INT, -- ID của nhân viên xác nhận hóa đơn
    @vat FLOAT = 0.08, -- Mức VAT mặc định là 8%
    @batch_size INT = 100 -- Số lượng hóa đơn xử lý mỗi lần
AS
BEGIN
    BEGIN TRY
        -- Mở một transaction duy nhất cho toàn bộ quá trình
        BEGIN TRAN;

        DECLARE @order_id INT;
        DECLARE @servile_manner_rating INT;
        DECLARE @branch_rating INT;
        DECLARE @food_quality_rating INT;
        DECLARE @price_rating INT;
        DECLARE @surroundings_rating INT;
        DECLARE @personal_response NVARCHAR(255) = N'Thank you for your service';

        -- Tạo các rating ngẫu nhiên từ 1 đến 10
        SET @servile_manner_rating = FLOOR(RAND() * 10) + 1;
        SET @branch_rating = FLOOR(RAND() * 10) + 1;
        SET @food_quality_rating = FLOOR(RAND() * 10) + 1;
        SET @price_rating = FLOOR(RAND() * 10) + 1;
        SET @surroundings_rating = FLOOR(RAND() * 10) + 1;

        -- Lấy tổng số hóa đơn pending
        DECLARE @total_pending_orders INT = (SELECT COUNT(*)
                                              FROM [Order] O
                                              WHERE O.order_status = 'pending'
                                              AND EXISTS (SELECT 1
                                                          FROM Bill B
                                                          WHERE B.order_id = O.order_id
                                                          AND O.staff_id = @user_id));

        -- Xử lý hóa đơn theo lô
        DECLARE @processed_orders INT = 0;

        -- Chạy đến khi xử lý hết các hóa đơn
        WHILE @processed_orders < @total_pending_orders
        BEGIN
            -- Tìm các hóa đơn 'pending' trong một lô nhỏ
            DECLARE order_cursor CURSOR FOR
                SELECT TOP (@batch_size) O.order_id
                FROM [Order] O
                WHERE O.order_status = 'pending'
                AND EXISTS (SELECT 1
                            FROM Bill B
                            WHERE B.order_id = O.order_id
                            AND O.staff_id = @user_id)
                ORDER BY O.order_id;

            OPEN order_cursor;
            FETCH NEXT FROM order_cursor INTO @order_id;

            -- Duyệt qua các hóa đơn và xác nhận từng hóa đơn
            WHILE @@FETCH_STATUS = 0
            BEGIN
                -- Gọi stored procedure để xác nhận đơn hàng
                EXEC sp_confirm_direct_service_order 
                    @user_id = @user_id, 
                    @order_id = @order_id, 
                    @vat = @vat, 
                    @servile_manner_rating = @servile_manner_rating,
                    @branch_rating = @branch_rating,
                    @food_quality_rating = @food_quality_rating,
                    @price_rating = @price_rating,
                    @surroundings_rating = @surroundings_rating,
                    @personal_response = @personal_response;

                SET @processed_orders = @processed_orders + 1;

                -- Lấy hóa đơn tiếp theo
                FETCH NEXT FROM order_cursor INTO @order_id;
            END;

            -- Đóng và giải phóng cursor
            CLOSE order_cursor;
            DEALLOCATE order_cursor;

            -- Giữ lại transaction mở cho lần xử lý tiếp theo
        END;

        -- Sau khi xử lý tất cả các hóa đơn, commit transaction
        COMMIT TRANSACTION;

        PRINT 'All orders have been confirmed successfully.';
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi, rollback transaction
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @error_message NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @error_severity INT = ERROR_SEVERITY();
        DECLARE @error_state INT = ERROR_STATE();

        RAISERROR(@error_message, @error_severity, @error_state);
    END CATCH
END;
GO

EXEC sp_confirm_orders_for_staff 6, 0.08