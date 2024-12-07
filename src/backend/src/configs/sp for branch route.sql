USE SushiXRestaurant;
GO
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



-- nháp mẫu chi nhánh B001 có 98 món đầu tiên



SELECT * FROM MenuCategory;
SELECT * FROM BranchMenuItem;
SELECT * FROM MenuItemCategory;

-- START
-- 4.1 Thêm menu theo khu vực (branch), món này phải có trong MenuItem trước rồi mới được add vào branch
CREATE OR ALTER PROCEDURE sp_add_menu_branch
    @p_branch_id VARCHAR(10),
    @p_item_id VARCHAR(10),
    @p_category_id VARCHAR(10) -- Kiểm tra trong bảng MenuCategory
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra chi nhánh có tồn tại không
        IF NOT EXISTS (SELECT 1 FROM Branch WHERE branch_id = @p_branch_id)
        BEGIN
            THROW 50000, 'Chi nhánh không tồn tại.', 1;
        END

        -- 2. Kiểm tra category_id có tồn tại trong MenuCategory không
        IF NOT EXISTS (SELECT 1 FROM MenuCategory WHERE category_id = @p_category_id)
        BEGIN
            THROW 50001, 'Danh mục không tồn tại.', 1;
        END

        -- 3. Kiểm tra item_id có tồn tại và đang ở trạng thái 'available' trong MenuItem không
        IF NOT EXISTS (
            SELECT 1 
            FROM MenuItem 
            WHERE item_id = @p_item_id AND menu_item_status = N'available'
        )
        BEGIN
            THROW 50002, 'Món ăn không tồn tại hoặc đang ở trạng thái unavailable.', 1;
        END

        -- 4. Kiểm tra item_id đã có trong BranchMenuItem chưa
        IF EXISTS (SELECT 1 FROM BranchMenuItem WHERE branch_id = @p_branch_id AND item_id = @p_item_id)
        BEGIN
            THROW 50003, 'Món ăn đã tồn tại trong chi nhánh.', 1;
        END

        -- 5. Thêm món ăn vào bảng BranchMenuItem
        INSERT INTO BranchMenuItem(branch_id, item_id, is_available)
        VALUES(@p_branch_id, @p_item_id, 1);

        -- 6. Kiểm tra và thêm liên kết danh mục vào MenuItemCategory nếu chưa tồn tại
        IF NOT EXISTS (SELECT 1 FROM MenuItemCategory WHERE item_id = @p_item_id AND category_id = @p_category_id)
        BEGIN
            INSERT INTO MenuItemCategory(item_id, category_id)
            VALUES(@p_item_id, @p_category_id);
        END

        -- Commit transaction nếu không có lỗi
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback khi gặp lỗi
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

SELECT * FROM MenuItem;

EXEC sp_add_menu_branch 'B002', 'ND14', 'ND'

-- Khi cần xóa một món gì đó ra khỏi MenuItem thì xóa nguyên chuỗi như bên dưới:
-- DEBUG	
SELECT * FROM MenuItemCategory
SELECT * FROM BranchMenuItem;
SELECT * FROM MenuItem;

SELECT * FROM MenuItem WHERE menu_item_status = N'unavailable';
/* ============ */

-- 4.2 Xóa menu theo khu vực (branch)

CREATE OR ALTER PROCEDURE sp_delete_menu_branch
    @p_branch_id VARCHAR(10),
    @p_item_id VARCHAR(10)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra chi nhánh có tồn tại không
        IF NOT EXISTS (SELECT 1 FROM Branch WHERE branch_id = @p_branch_id)
        BEGIN
            THROW 50000, 'Chi nhánh không tồn tại.', 1;
        END

        -- 2. Kiểm tra item_id có tồn tại trong MenuItem không
        IF NOT EXISTS (
            SELECT 1 
            FROM MenuItem 
            WHERE branch_id = @p_branch_id AND item_id = @p_item_id
        )
        BEGIN
            THROW 50001, 'item_id không tồn tại trong chi nhánh này.', 1;
        END

        -- 3. Xóa liên kết trong BranchMenuItem
        DELETE FROM BranchMenuItem 
        WHERE branch_id = @p_branch_id AND item_id = @p_item_id;

        -- Commit transaction nếu không có lỗi
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback khi gặp lỗi
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

-- nháp thử
-- 4.1
EXEC sp_add_menu_branch 'B002','Y6','Y';

-- 4.2
EXEC sp_delete_menu_branch 'B002', 'Y6';

-- 4.3
sp_change_status_branch 'B002', 'ND13', 1;
SELECT * FROM BranchMenuItem WHERE branch_id = 'B002';
SELECT * FROM MenuItem;
SELECT * FROM MenuItemCategory 

SELECT * 
FROM MenuItem 
WHERE item_id LIKE N'ND%';

-- 4.3 Chỉnh sửa thông tin menu theo khu vực (branch) (đang phục vụ, tạm ngưng)
SELECT * FROM BranchMenuItem;
CREATE OR ALTER PROCEDURE sp_change_status_branch
    @p_branch_id VARCHAR(10),
    @p_item_id VARCHAR(10),
    @p_is_available BIT
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra chi nhánh có tồn tại không
        IF NOT EXISTS (SELECT 1 FROM Branch WHERE branch_id = @p_branch_id)
        BEGIN
            THROW 50000, 'Chi nhánh không tồn tại.', 1;
        END

        -- 2. Kiểm tra item_id có tồn tại trong chi nhánh không
        IF NOT EXISTS (
            SELECT 1
            FROM BranchMenuItem
            WHERE branch_id = @p_branch_id AND item_id = @p_item_id
        )
        BEGIN
            THROW 50001, 'item_id không tồn tại trong chi nhánh này.', 1;
        END

        -- 3. Kiểm tra trạng thái hiện tại của món ăn
        DECLARE @current_status BIT;
        SELECT @current_status = is_available
        FROM BranchMenuItem
        WHERE branch_id = @p_branch_id AND item_id = @p_item_id;

        -- Nếu trạng thái không thay đổi
        IF @current_status = @p_is_available
        BEGIN
            IF @p_is_available = 1
                THROW 50002, 'Món ăn đã ở trạng thái đang phục vụ.', 1;
            ELSE
                THROW 50003, 'Món ăn đã ở trạng thái tạm ngưng.', 1;
        END

        -- 4. Cập nhật trạng thái món ăn
        UPDATE BranchMenuItem
        SET is_available = @p_is_available
        WHERE branch_id = @p_branch_id AND item_id = @p_item_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback khi gặp lỗi
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

-- 4.4 Thêm món ăn vào trong MenuItem

SELECT * FROM MenuItem;

CREATE OR ALTER PROCEDURE sp_add_menu
    @p_item_name NVARCHAR(50),
    @p_description NVARCHAR(255),
    @p_base_price FLOAT,
    @p_status BIT,
    @p_category_id VARCHAR(10), 
	@p_image_url TEXT
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra category_id có tồn tại trong MenuCategory không
        IF NOT EXISTS (SELECT 1 FROM MenuCategory WHERE category_id = @p_category_id)
        BEGIN
            THROW 50000, 'Danh mục không tồn tại.', 1;
        END

        -- 2. Tạo ID mới cho món ăn dựa trên category_id
        DECLARE @new_item_id VARCHAR(10);
        DECLARE @numeric_part INT;

        -- Tách phần chữ và số trong item_id
        DECLARE @category_prefix VARCHAR(10);
        SET @category_prefix = @p_category_id;

        -- Lấy phần số lớn nhất của item_id theo category_id
        SET @numeric_part = (
            SELECT ISNULL(MAX(CAST(SUBSTRING(item_id, LEN(@category_prefix) + 1, LEN(item_id)) AS INT)), 0) + 1
            FROM MenuItem
            WHERE LEFT(item_id, LEN(@category_prefix)) = @category_prefix
            AND ISNUMERIC(SUBSTRING(item_id, LEN(@category_prefix) + 1, LEN(item_id))) = 1
        );

        -- Tạo item_id mới với format "category_id + số"
        SET @new_item_id = @category_prefix + CAST(@numeric_part AS VARCHAR(3));

        -- 3. Thêm món ăn vào bảng MenuItem
        INSERT INTO MenuItem(item_id, item_name, menu_item_description, base_price, menu_item_status, image_url)
        VALUES(@new_item_id, @p_item_name, @p_description, @p_base_price, 
               CASE WHEN @p_status = 1 THEN 'available' ELSE 'unavailable' END, @p_image_url);

        -- 4. Thêm liên kết danh mục vào bảng MenuItemCategory
        INSERT INTO MenuItemCategory(item_id, category_id)
        VALUES(@new_item_id, @p_category_id);


        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback khi gặp lỗi
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

EXEC sp_add_menu N'UDON XÀO XÁO XAO', NULL, 22000, 0, 'ND', NULL;

SELECT * FROM MenuItem;
	
-- 4.5 Xóa món ăn xóa khỏi MenuItem -> xóa khỏi BranchMenuItem
CREATE OR ALTER PROCEDURE sp_delete_MenuItem
    @p_item_id VARCHAR(10)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra có tồn tại item_id này trong MenuItem
        IF NOT EXISTS (SELECT 1 FROM MenuItem WHERE item_id = @p_item_id)
        BEGIN
            THROW 50000, 'item_id không tồn tại trong MenuItem', 1;
        END

        -- 2. Xóa tất cả các liên kết trong MenuItemCategory và BranchMenuItem
        DELETE FROM MenuItemCategory WHERE item_id = @p_item_id;
        DELETE FROM BranchMenuItem WHERE item_id = @p_item_id;

        -- 3. Xóa món ăn khỏi MenuItem
        DELETE FROM MenuItem WHERE item_id = @p_item_id;

        -- Commit transaction nếu không có lỗi
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback khi gặp lỗi
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
SELECT * FROM MenuItem;
SELECT * FROM MenuItemCategory;
SELECT * FROM BranchMenuItem;
EXEC sp_delete_MenuItem 'ND14';


-- 4.6 Thêm combo món ăn
CREATE OR ALTER PROCEDURE sp_add_combo
    @p_combo_name NVARCHAR(50),
    @p_combo_description NVARCHAR(255),
    @p_item_ids VARCHAR(MAX) -- Danh sách item_id, ví dụ 'A1,A10,A4,F3,FJ2'
AS
BEGIN
    DECLARE @new_combo_id VARCHAR(10);
    DECLARE @item_id VARCHAR(10);
    DECLARE @pos INT;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Loại bỏ khoảng trắng dư thừa giữa các item_id
        SET @p_item_ids = REPLACE(@p_item_ids, ' ', ''); -- Loại bỏ tất cả khoảng trắng

        -- 2. Tạo combo_id mới (SC1, SC2, SC3, ...)
        -- Lấy số combo_id lớn nhất hiện tại và tăng thêm 1
        SET @new_combo_id = 'SC' + CAST(
            (SELECT ISNULL(MAX(CAST(SUBSTRING(combo_id, 3, LEN(combo_id)) AS INT)), 0) + 1 FROM Combo) 
            AS VARCHAR(3));
        
        -- 3. Thêm combo vào bảng Combo
        INSERT INTO Combo (combo_id, combo_name, combo_description)
        VALUES (@new_combo_id, @p_combo_name, @p_combo_description);

        -- 4. Chia danh sách item_ids thành các phần tử
        SET @pos = CHARINDEX(',', @p_item_ids);
        
        -- 5. Kiểm tra sự tồn tại của item_id trước khi thêm vào ComboMenuItem
        WHILE @pos > 0
        BEGIN
            SET @item_id = SUBSTRING(@p_item_ids, 1, @pos - 1);

            -- Kiểm tra item_id có tồn tại trong MenuItem không
            IF NOT EXISTS (SELECT 1 FROM MenuItem WHERE item_id = @item_id)
            BEGIN
                THROW 50000, 'Món ăn không tồn tại trong MenuItem.', 1;
            END

            -- Thêm item vào ComboMenuItem
            INSERT INTO ComboMenuItem (combo_id, item_id)
            VALUES (@new_combo_id, @item_id);

            -- Cập nhật danh sách item_ids để tiếp tục xử lý phần tử tiếp theo
            SET @p_item_ids = SUBSTRING(@p_item_ids, @pos + 1, LEN(@p_item_ids));
            SET @pos = CHARINDEX(',', @p_item_ids);
        END

        -- Thêm item cuối cùng (không có dấu ',' ở cuối)
        IF LEN(@p_item_ids) > 0
        BEGIN
            SET @item_id = @p_item_ids;
            
            -- Kiểm tra item_id có tồn tại trong MenuItem không
            IF NOT EXISTS (SELECT 1 FROM MenuItem WHERE item_id = @item_id)
            BEGIN
                THROW 50000, 'Món ăn không tồn tại trong MenuItem.', 1;
            END
            
            -- Thêm item vào ComboMenuItem
            INSERT INTO ComboMenuItem (combo_id, item_id)
            VALUES (@new_combo_id, @item_id);
        END

        -- Commit transaction nếu không có lỗi
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback khi gặp lỗi
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;



/*
CREATE TABLE ComboMenuItem
(
    combo_id VARCHAR(10) NOT NULL,  -- ID của Combo
    item_id VARCHAR(10) NOT NULL,   -- ID của món ăn
    CONSTRAINT PK_ComboMenuItem PRIMARY KEY (combo_id, item_id),  -- Khóa chính là sự kết hợp giữa combo_id và item_id
    CONSTRAINT FK_ComboMenuItem_Combo FOREIGN KEY (combo_id) REFERENCES Combo (combo_id) ON DELETE CASCADE,  -- Ràng buộc khóa ngoại với bảng Combo
    CONSTRAINT FK_ComboMenuItem_MenuItem FOREIGN KEY (item_id) REFERENCES MenuItem (item_id) ON DELETE CASCADE  -- Ràng buộc khóa ngoại với bảng MenuItem
);
*/

EXEC sp_add_combo N'Combo Lẩu 3 Món', N'LẨU LẨU LẨU', 'HP1, HO2, IC1';

SELECT * FROM Combo;
SELECT * FROM ComboMenuItem;

-- 4.7 Xóa combo

CREATE OR ALTER PROCEDURE sp_delete_combo
    @p_combo_id VARCHAR(10)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra xem combo có tồn tại trong bảng Combo hay không
        IF NOT EXISTS (SELECT 1 FROM Combo WHERE combo_id = @p_combo_id)
        BEGIN
            THROW 50000, 'Combo không tồn tại.', 1;
        END

        -- 2. Xóa các item liên quan đến combo trong ComboMenuItem
        DELETE FROM ComboMenuItem WHERE combo_id = @p_combo_id;

        -- 3. Xóa combo khỏi bảng Combo
        DELETE FROM Combo WHERE combo_id = @p_combo_id;


        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

EXEC sp_delete_combo 'SC1';
