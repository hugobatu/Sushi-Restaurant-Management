GO
USE SushiXRestaurant;

-- xem danh sách menu của chi nhánh
GO
CREATE OR ALTER PROCEDURE sp_get_branches_menu_items
	@branch_id VARCHAR(10)
AS
BEGIN
	BEGIN TRY
	    SELECT 
			B.item_id,
			M.item_name,
			B.is_available,
			M.base_price
		FROM BranchMenuItem B
		JOIN MenuItem M 
		ON B.item_id = M.item_id
		WHERE B.branch_id = @branch_id
		ORDER BY branch_id, B.item_id;
	END TRY

	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH
END
GO
-- 4.1 Thêm menu theo khu vực (branch), món này phải có trong MenuItem trước rồi mới được add vào branch
GO
CREATE OR ALTER PROCEDURE sp_add_menu_branch
    @branch_id VARCHAR(10),
    @item_id VARCHAR(10)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra chi nhánh có tồn tại không
        IF NOT EXISTS (SELECT 1 FROM Branch WHERE branch_id = @branch_id)
        BEGIN
            RAISERROR('This branch does not exist', 16, 1);
        END

        -- 2. Kiểm tra món ăn có tồn tại trong MenuItem không
        IF NOT EXISTS (SELECT 1 FROM MenuItem WHERE item_id = @item_id)
        BEGIN
            RAISERROR('This item does not exist in menu', 16, 1);
        END

        -- 3. Kiểm tra item_id có tồn tại và đang ở trạng thái 'available' trong MenuItem không
        IF NOT EXISTS (
            SELECT 1 
            FROM MenuItem 
            WHERE item_id = @item_id AND menu_item_status = N'available'
        )
        BEGIN
            RAISERROR('This menu item does not exist or have been added to the branch already', 16, 1);
        END

        -- 4. Kiểm tra item_id đã có trong BranchMenuItem chưa
        IF EXISTS (SELECT 1 FROM BranchMenuItem WHERE branch_id = @branch_id AND item_id = @item_id)
        BEGIN
            RAISERROR('This menu item is exists in the branch already', 16, 1);
        END

        -- 5. Thêm món ăn vào bảng BranchMenuItem
        INSERT INTO BranchMenuItem(branch_id, item_id, is_available)
        VALUES(@branch_id, @item_id, 1);


        -- Commit transaction nếu không có lỗi
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback khi gặp lỗi
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;


		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;

/* Test procs 4.1 */
--SELECT * FROM MenuItem;
--EXEC sp_add_menu_branch 'B002', 'ND14', 'ND'

-- Khi cần xóa một món gì đó ra khỏi MenuItem thì xóa nguyên chuỗi như bên dưới:
-- DEBUG	
--SELECT * FROM MenuItemCategory
--SELECT * FROM BranchMenuItem;
--SELECT * FROM MenuItem;

--SELECT * FROM MenuItem WHERE menu_item_status = N'unavailable';

/* ============ */
-- 4.2 Xóa menu theo khu vực (branch)
GO
CREATE OR ALTER PROCEDURE sp_delete_menu_branch
    @branch_id VARCHAR(10),
    @item_id VARCHAR(10)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra chi nhánh có tồn tại không
        IF NOT EXISTS (SELECT 1 FROM Branch WHERE branch_id = @branch_id)
        BEGIN
            RAISERROR('This branch does not exist.', 16, 1);
        END

        -- 2. Kiểm tra item_id có tồn tại trong MenuItem không
        IF NOT EXISTS (
            SELECT 1
            FROM BranchMenuItem
            WHERE branch_id = @branch_id AND item_id = @item_id
        )
        BEGIN
            RAISERROR('This item id does not exist in this branch.', 16, 1);
        END

        -- 3. Xóa liên kết trong BranchMenuItem
        DELETE FROM BranchMenuItem 
        WHERE branch_id = @branch_id AND item_id = @item_id;

        -- Commit transaction nếu không có lỗi
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback khi gặp lỗi
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;


		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;

---- test thử
---- 4.1
--EXEC sp_add_menu_branch 'B002','Y6','Y';

---- 4.2
--EXEC sp_delete_menu_branch 'B002', 'Y6';

---- 4.3
--EXEC sp_change_status_branch_menu_item 'B002', 'ND11', 1;
--SELECT * FROM BranchMenuItem WHERE branch_id = 'B002';
--SELECT * FROM MenuItem;
--SELECT * FROM MenuItemCategory 

--SELECT * 
--FROM MenuItem 
--WHERE item_id LIKE N'ND%';

-- 4.3 Chỉnh sửa thông tin menu theo khu vực (branch) (đang phục vụ, tạm ngưng)
--SELECT * FROM BranchMenuItem;
GO
CREATE OR ALTER PROCEDURE sp_change_status_branch_menu_item
    @branch_id VARCHAR(10),
    @item_id VARCHAR(10),
    @is_available BIT
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra chi nhánh có tồn tại không
        IF NOT EXISTS (SELECT 1 FROM Branch WHERE branch_id = @branch_id)
        BEGIN
			RAISERROR('This branch does not exist.', 16, 1);
        END

        -- 2. Kiểm tra item_id có tồn tại trong chi nhánh không
        IF NOT EXISTS (
            SELECT 1
            FROM BranchMenuItem
            WHERE branch_id = @branch_id AND item_id = @item_id
        )
        BEGIN
			RAISERROR('This item does not exist in this branch bro.', 16, 1);
        END

        -- 3. Kiểm tra trạng thái hiện tại của món ăn
        DECLARE @current_status BIT;
        SELECT @current_status = is_available
        FROM BranchMenuItem
        WHERE branch_id = @branch_id AND item_id = @item_id;

        -- Nếu trạng thái không thay đổi
        IF @current_status = @is_available
        BEGIN
            IF @is_available = 1
				RAISERROR('This item is already in the available status bro.', 16, 1);
            ELSE
				RAISERROR('This item is already in the pending status bro.', 16, 1);
        END

        -- 4. Cập nhật trạng thái món ăn
        UPDATE BranchMenuItem
        SET is_available = @is_available
        WHERE branch_id = @branch_id AND item_id = @item_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback khi gặp lỗi
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;


		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;

-- 4.6 xem danh sách đánh giá nhân viên tại 1 chi nhánh
GO
CREATE OR ALTER PROCEDURE sp_get_branch_staff_ratings
    @user_id INT,
    @page_number INT,
    @page_size INT
AS
BEGIN
    BEGIN TRY
        -- Declare variables
        DECLARE @branch_id VARCHAR(10);
        DECLARE @offset INT;

        -- Get the branch ID for the manager
        SET @branch_id = (
            SELECT TOP 1 B.branch_id
            FROM Branch B
            JOIN Department D
                ON B.branch_id = D.branch_id
            JOIN Staff S
                ON S.department_id = D.department_id
            WHERE S.staff_id = @user_id AND D.department_name = 'manager'
        );

        -- Ensure @branch_id is not NULL
        IF @branch_id IS NULL
        BEGIN
            THROW 50001, 'Branch not found for the given user ID.', 1;
        END

        -- Calculate offset for pagination
        SET @offset = (@page_number - 1) * @page_size;

        -- Fetch staff ratings with pagination
        SELECT
            S.staff_id,
            S.staff_name,
            AVG(CR.service_manner_rating) AS Rating
        FROM CustomerRating CR
        JOIN Staff S     
            ON CR.staff_id = S.staff_id
        JOIN Department D
            ON D.department_id = S.department_id
        WHERE D.branch_id = @branch_id
        GROUP BY S.staff_id, S.staff_name
        ORDER BY AVG(CR.service_manner_rating) DESC
        OFFSET @offset ROWS
        FETCH NEXT @page_size ROWS ONLY;

    END TRY
    BEGIN CATCH
        -- Error handling
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO