--GO
--USE SushiXRestaurant

--GO
--CREATE OR ALTER PROCEDURE sp_update_membership_level
--    @customer_id INT
--AS
--BEGIN
--    BEGIN TRY
--        BEGIN TRANSACTION;

--        -- 1. lấy thông tin thẻ hiện tại của khách hàng
--        DECLARE @card_id INT, @level_id INT, @issued_date DATE, @points INT, @current_level NVARCHAR(20);
--        SELECT 
--            @card_id = card_id,
--            @level_id = level_id,
--            @issued_date = issued_date,
--            @points = points
--        FROM Membership
--        WHERE customer_id = @customer_id AND membership_status = N'active';

--        IF @card_id IS NULL
--        BEGIN
--            RAISERROR(N'Customer does not have an active membership.', 16, 1);
--            RETURN;
--        END

--        -- 2. Lấy thông tin về hạng thẻ hiện tại
--        SELECT @current_level = level_name
--        FROM MembershipLevel
--        WHERE level_id = @level_id;

--        -- 3. Tính tổng giá trị tiêu dùng trong vòng 1 năm kể từ ngày đạt hạng
--        DECLARE @total_spending FLOAT = (
--            SELECT SUM(total_amount)
--            FROM Bill
--			JOIN 
--            WHERE customer_id = @customer_id 
--              AND bill_date >= DATEADD(YEAR, -1, @issued_date)
--        );

--        IF @total_spending IS NULL SET @total_spending = 0;

--        -- 4. Lấy thông tin điều kiện giữ hạng, nâng hạng, và xuống hạng
--        DECLARE @maintenance_spending FLOAT, @min_spending FLOAT, @next_level NVARCHAR(20), @next_level_id INT;

--        SELECT 
--            @maintenance_spending = maintenance_spending,
--            @min_spending = min_spending
--        FROM MembershipLevel
--        WHERE level_id = @level_id;

--        SELECT 
--            @next_level = level_name,
--            @next_level_id = level_id
--        FROM MembershipLevel
--        WHERE level_name = N'gold';

--        -- 5. Kiểm tra hạng và cập nhật
--        IF @current_level = N'silver'
--        BEGIN
--            IF @total_spending >= @min_spending
--            BEGIN
--                -- Nâng lên GOLD
--                UPDATE Membership
--                SET level_id = @next_level_id, issued_date = GETDATE(), points = @points
--                WHERE card_id = @card_id;
--            END
--            ELSE IF @total_spending < @maintenance_spending
--            BEGIN
--                -- Xuống Membership
--                UPDATE Membership
--                SET level_id = NULL, membership_status = N'expire'
--                WHERE card_id = @card_id;
--            END
--        END
--        ELSE IF @current_level = N'gold'
--        BEGIN
--            IF @total_spending < @maintenance_spending
--            BEGIN
--                -- Xuống SILVER
--                DECLARE @silver_level_id INT;
--                SELECT @silver_level_id = level_id FROM MembershipLevel WHERE level_name = N'silver';

--                UPDATE Membership
--                SET level_id = @silver_level_id, issued_date = GETDATE(), points = @points
--                WHERE card_id = @card_id;
--            END
--        END

--        COMMIT TRANSACTION;
--    END TRY
--    BEGIN CATCH
--        IF @@TRANCOUNT > 0
--            ROLLBACK TRANSACTION;

--        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
--        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
--        DECLARE @ErrorState INT = ERROR_STATE();

--        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
--    END CATCH
--END;

--exec sp_update_membership_level 1