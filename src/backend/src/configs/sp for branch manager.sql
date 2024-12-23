USE SushiXRestaurant;
GO
SELECT * FROM MenuItem
SELECT * FROM MenuCategory
/*
-- sp kiểm tra menu có tại chi nhánh B001
CREATE OR ALTER PROCEDURE sp_get_branch_menu
    @branch_id CHAR(10)
AS
BEGIN
    SELECT 
        mi.item_id,
        mi.item_name,
        mi.menu_item_description,
        mi.base_price,
        mi.menu_item_status,
        mc.category_name
    FROM 
        BranchMenuItem bmi
    JOIN MenuItem mi ON bmi.item_id = mi.item_id
    JOIN MenuItemCategory mic ON mi.item_id = mic.item_id
    JOIN MenuCategory mc ON mic.category_id = mc.category_id
    WHERE 
        bmi.branch_id = @branch_id AND bmi.is_available = 1;
END;
GO

EXEC sp_get_branch_menu @branch_id = 'B001';

SELECT * FROM MenuCategory;
*/
-- sp kiểm tra các chi nhánh 
/*
CREATE OR ALTER PROCEDURE sp_get_all_branches
AS
BEGIN
	SELECT * FROM Branch;
END

EXEC sp_get_all_branches;
*/

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