GO
USE SushiXRestaurant

-- 1. add a new region
GO
CREATE OR ALTER PROCEDURE sp_add_region
    @region_name NVARCHAR(50)
AS
BEGIN
    BEGIN TRY
		BEGIN TRAN
        -- check if the region name already exists
        IF EXISTS (
            SELECT 1
            FROM Region
            WHERE region_name = UPPER(@region_name)
        )
        BEGIN
            RAISERROR('Region already exists in the database.', 16, 1);
        END

        DECLARE @new_region_id VARCHAR(10);
        SELECT @new_region_id = STRING_AGG(LEFT(value, 1), '')
        FROM STRING_SPLIT(@region_name, ' ');

        IF EXISTS (
            SELECT 1
            FROM Region
            WHERE region_id = @new_region_id
        )
        BEGIN
            RAISERROR('Region ID already exists in the database.', 16, 1);
        END

        INSERT INTO Region (region_id, region_name)
        VALUES (UPPER(@new_region_id), UPPER(@region_name));

		COMMIT TRAN

        PRINT 'New region added successfully with ID: ' + UPPER(@new_region_id);
    END TRY
    BEGIN CATCH
		IF (@@TRANCOUNT > 0)
		BEGIN
			ROLLBACK TRAN;
		END

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
-- auto add table to branch
GO
CREATE OR ALTER PROCEDURE sp_add_table
    @branch_id VARCHAR(10),
    @num_tables INT = 10,
    @capacity INT = 4
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN;

        -- Check if the branch exists
        IF NOT EXISTS (
            SELECT 1
            FROM Branch
            WHERE branch_id = @branch_id
        )
        BEGIN
            RAISERROR('Branch ID cannot be found.', 16, 1);
            ROLLBACK TRAN;
        END;

        -- Check if tables already exist for this branch
        IF EXISTS (
            SELECT 1
            FROM [Table]
            WHERE branch_id = @branch_id
        )
        BEGIN
            RAISERROR('Tables already exist for this branch.', 16, 1);
            ROLLBACK TRAN;
        END;

        -- Insert default tables
        DECLARE @i INT = 1;
        WHILE @i <= @num_tables
        BEGIN
            INSERT INTO [Table] (branch_id, capacity, is_available)
            VALUES (@branch_id, @capacity, 1);
            SET @i = @i + 1;
        END;

        COMMIT TRAN;

        PRINT CONCAT(@num_tables, ' tables have been successfully added for branch ', @branch_id, '.');
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
-- 2. add a new branch
GO
CREATE OR ALTER PROC sp_add_new_branch
    @region_id VARCHAR(10),
    @branch_name NVARCHAR(50),
    @branch_address NVARCHAR(50),
    @opening_time TIME,
    @closing_time TIME,
    @phone_number VARCHAR(10),
    @has_bike_parking_lot BIT,
    @has_car_parking_lot BIT
AS
BEGIN
    BEGIN TRY
		BEGIN TRAN
        -- check if region exists
		IF EXISTS (
			SELECT 1
			FROM Branch
			WHERE branch_name = @branch_name
		)
		BEGIN
            RAISERROR('Region does not exist', 16, 1);
        END
		-- check if the branch already exists
        IF NOT EXISTS (
            SELECT 1
            FROM Region
            WHERE region_id = UPPER(@region_id)
        )
        BEGIN
            RAISERROR('Region does not exist', 16, 1);
        END

        -- generate new branch id
        DECLARE @new_branch_id VARCHAR(10);
        SELECT @new_branch_id = 'B' + RIGHT(
			'000' + CAST(ISNULL(MAX(CAST(SUBSTRING(
				branch_id, 2, LEN(branch_id) - 1) AS INT)), 0) + 1 AS VARCHAR), 3)
        FROM Branch;

        -- insert the new branch
        INSERT INTO Branch (
            branch_id, region_id, branch_name, branch_address,
            opening_time, closing_time, phone_number, 
            has_bike_parking_lot, has_car_parking_lot
        )
        VALUES (
            @new_branch_id, UPPER(@region_id), UPPER(@branch_name), UPPER(@branch_address), 
            @opening_time, @closing_time, @phone_number,
            @has_bike_parking_lot, @has_car_parking_lot
        );

		-- copying menu to new branch
		INSERT INTO BranchMenuItem (branch_id, item_id, is_available)
		SELECT @new_branch_id, item_id, 1
		FROM MenuItem
		-- auto add table
		EXEC sp_add_table @new_branch_id, @num_tables = 30, @capacity = 4
		INSERT INTO Department(branch_id, department_name, base_salary) VALUES
		(@new_branch_id, 'chef', 20000000),
		(@new_branch_id, 'manager', 18000000),
		(@new_branch_id, 'staff', 15000000),
		(@new_branch_id, 'security', 12000000)
		COMMIT TRAN
		-- auto add Department
        PRINT 'Branch added successfully with ID: ' + @new_branch_id;
    END TRY
    BEGIN CATCH
		IF (@@TRANCOUNT > 0)
		BEGIN
			ROLLBACK TRAN;
		END
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
-- 3. update branch status (working/closed/maintenance)
GO
CREATE OR ALTER PROC sp_update_branch_status
    @branch_id VARCHAR(10),
    @new_status NVARCHAR(50),
	@has_bike_parking_lot BIT,
	@has_car_parking_lot BIT
AS
BEGIN
    BEGIN TRY
		BEGIN TRAN
		-- check if branch id have existed
		IF NOT EXISTS(
			SELECT 1
			FROM Branch
			WHERE branch_id = @branch_id
		)
		BEGIN
			RAISERROR('BranchID not found', 16, 1);
		END
        -- check if the new status is valid
        IF @new_status NOT IN (N'working', N'closed', N'maintenance')
        BEGIN
            RAISERROR('Invalid branch status provided.', 16, 1);
        END;
		
		IF EXISTS (
			SELECT 1
			FROM Branch
			WHERE branch_id = @branch_id AND branch_status = LOWER(@new_status)
		)
		BEGIN
			RAISERROR('Branch are already in this status', 16, 1);
		END
        -- update the branch status
        UPDATE Branch
        SET branch_status = @new_status
        WHERE branch_id = UPPER(@branch_id);
		-- update has bike parking lot
		UPDATE Branch
        SET has_bike_parking_lot = @has_bike_parking_lot
        WHERE branch_id = UPPER(@branch_id);
		-- update has car parking lot
		UPDATE Branch
        SET has_car_parking_lot = @has_car_parking_lot
        WHERE branch_id = UPPER(@branch_id);

		COMMIT TRAN

        PRINT 'Branch status updated successfully.';
    END TRY
    BEGIN CATCH
		IF (@@TRANCOUNT > 0)
		BEGIN
			ROLLBACK TRAN;
		END

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
-- 4. get all branch information
GO
CREATE OR ALTER PROC sp_get_branches_data
AS
BEGIN
    SELECT *
    FROM Branch
    ORDER BY branch_id
END
GO
-- 5. add a new staff (ORM)
/*GO
CREATE OR ALTER PROCEDURE sp_add_staff
    @branch_id VARCHAR(10),
    @department_name NVARCHAR(50),
    @staff_name NVARCHAR(50),
    @birth_date DATE,
	@phone_number VARCHAR(10),
    @gender NVARCHAR(10),
    @join_date DATE,
    @staff_status NVARCHAR(20) = N'active', -- default is 'active'
    @username VARCHAR(50) = NULL -- optional
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN;

        -- Check if branch exists
        IF NOT EXISTS (
			SELECT 1 
			FROM Branch 
			WHERE branch_id = UPPER(@branch_id)
		)
        BEGIN
            RAISERROR('Branch does not exist.', 16, 1);
            RETURN;
        END;

        -- Check if department exists
        IF NOT EXISTS (
			SELECT 1 
			FROM Department 
			WHERE department_name = UPPER(@department_name) AND branch_id = @branch_id)
        BEGIN
            RAISERROR('Department does not exist.', 16, 1);
            RETURN;
        END;

		-- Check if the branch has manager already or not
		IF (@department_name = 'manager')
			BEGIN
			IF EXISTS (
				SELECT 1
				FROM Staff S
				JOIN Department D
				ON D.department_id = S.department_id
				WHERE D.department_name = @department_name AND D.branch_id = @branch_id
			)
			BEGIN
				RAISERROR('There is only one manager in each branch', 16, 1)
			END
		END
        -- Validate gender
        IF LOWER(@gender) NOT IN (N'male', N'female')
        BEGIN
            RAISERROR('Invalid gender value. Use "male" or "female".', 16, 1);
            RETURN;
        END;

		IF EXISTS (
			SELECT 1
			FROM Staff
			WHERE phone_number = @phone_number
		)
		BEGIN
			RAISERROR('This phone number is already used', 16, 1)
		END

        -- Get base salary based on department
        DECLARE @salary FLOAT;
        SELECT @salary = DP.base_salary
        FROM Department DP
        WHERE DP.department_name = @department_name
          AND DP.branch_id = @branch_id;

        -- Get department ID
        DECLARE @department_id INT;
        SELECT @department_id = DP.department_id
        FROM Department DP
        WHERE DP.department_name = @department_name
          AND DP.branch_id = @branch_id;

        -- If the staff is a manager, generate and insert an account

		
		SET @username = @phone_number;
        ELSE
            SET @username = @staff_initials + CAST(@existing_count + 1 AS VARCHAR);

        -- Insert into Account table
        INSERT INTO Account (username, account_type, account_status)
        VALUES (@username, 'manager', 'active');

        -- Insert new staff data
        INSERT INTO Staff (department_id, staff_name, birth_date, gender, salary, join_date, staff_status, username)
        VALUES (@department_id, UPPER(@staff_name), @birth_date, LOWER(@gender), @salary, @join_date, LOWER(@staff_status), @username);

        -- Optionally add the staff's initial work history
        DECLARE @new_staff_id INT = SCOPE_IDENTITY();
        INSERT INTO WorkHistory (staff_id, department_id, starting_date)
        VALUES (@new_staff_id, @department_id, @join_date);

        COMMIT TRAN;

        PRINT 'Staff member successfully added with ID: ' + CAST(@new_staff_id AS NVARCHAR);
    END TRY
    BEGIN CATCH
        IF (@@TRANCOUNT > 0)
        BEGIN
            ROLLBACK TRAN;
        END;

        -- Handle errors
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END; */

-- 6. sa thải nhân viên
GO
CREATE OR ALTER PROCEDURE sp_fire_staff
    @staff_id INT -- Assuming staff_id is INT
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN;

        -- Check if the staff exists and is already fired
        DECLARE @staff_status NVARCHAR(50);

        SELECT @staff_status = staff_status
        FROM Staff
        WHERE staff_id = @staff_id;

        IF @staff_status IS NULL
        BEGIN
            RAISERROR(N'This staff does not exist.', 16, 1);
            RETURN;
        END;

        IF @staff_status = N'resigned'
        BEGIN
            RAISERROR(N'This staff has already been fired.', 16, 1);
            RETURN;
        END;

        -- Update staff status to 'resigned'
        UPDATE Staff
        SET staff_status = N'resigned'
        WHERE staff_id = @staff_id;

        -- Update the latest work history record
        UPDATE WorkHistory
        SET ending_date = GETDATE()
        WHERE staff_id = @staff_id
          AND ending_date IS NULL;

        -- Deactivate the associated account
        UPDATE Account
        SET account_status = 'inactive'
        WHERE username = (
            SELECT username
            FROM Staff
            WHERE staff_id = @staff_id
        );

        COMMIT TRAN;

        PRINT N'Staff has been successfully fired.';
    END TRY
    BEGIN CATCH
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END;
GO
-- 7. update salary for staff or deparment	
GO
CREATE OR ALTER PROCEDURE sp_update_staff_salary
    @staff_id INT,
    @increase_rate FLOAT	   -- Increase rate (default is 10%)
AS
BEGIN
    BEGIN TRY
        -- Start transaction
        BEGIN TRAN;

        -- Validate increase rate
        IF @increase_rate <= 0
        BEGIN
            RAISERROR(N'Increase rate must be greater than 0.', 16, 1);
            RETURN;
        END

        -- Check if the staff member exists and is active
        IF NOT EXISTS (
            SELECT 1 
            FROM Staff 
            WHERE staff_id = @staff_id AND staff_status = N'active'
        )
        BEGIN
            RAISERROR(N'This staff does not exist or is not active.', 16, 1);
            RETURN;
        END

        -- Update salary
        UPDATE Staff
        SET salary = salary * (1 + @increase_rate)
        WHERE staff_id = @staff_id;

        -- Commit transaction
        COMMIT TRAN;

        PRINT N'Salary updated successfully.';
    END TRY
    BEGIN CATCH
        -- Rollback transaction in case of error
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        -- Raise the error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
-- 8. move a staff to another branch
GO
CREATE OR ALTER PROCEDURE sp_transfer_staff
    @staff_id INT,						-- id of new staff
    @new_branch_id VARCHAR(10),			-- id of new branch
    @new_department_name NVARCHAR(50)	-- new name of department
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN;
		-- check existence of staff
        IF NOT EXISTS (
            SELECT 1 
            FROM Staff 
            WHERE staff_id = @staff_id AND staff_status = N'active'
        )
        BEGIN
            RAISERROR(N'This staff is unriel or has resigned.', 16, 1);
        END;

		-- check existence of new department
        IF NOT EXISTS (
            SELECT 1 
            FROM Department
            WHERE department_name = @new_department_name AND branch_id = @new_branch_id
        )
        BEGIN
            RAISERROR(N'New department or branch is unriel.', 16, 1);
        END;
		
		IF EXISTS (
			SELECT 1
			FROM Staff S
			JOIN Department D
			ON D.department_id = S.department_id
			WHERE D.department_name = @new_department_name AND D.branch_id = @new_branch_id AND D.department_name = 'manager'
		)
		BEGIN
            RAISERROR(N'There must be only one manager in each branch.', 16, 1);
        END;

		 -- Get the current department and branch of the staff
        DECLARE @current_department_id INT;
        DECLARE @current_branch_id VARCHAR(10);
        SELECT 
            @current_department_id = S.department_id,
            @current_branch_id = B.branch_id
        FROM Staff S
        JOIN Department D ON S.department_id = D.department_id
        JOIN Branch B ON D.branch_id = B.branch_id
        WHERE S.staff_id = @staff_id;
        -- Check if the staff is already in the same branch and department
        IF EXISTS (
            SELECT 1
            FROM Department
            WHERE department_id = @current_department_id
				AND branch_id = @new_branch_id
				AND department_name = @new_department_name
        )
        BEGIN
            RAISERROR(N'This staff is already working in the specified branch and department.', 16, 1);
        END;

		DECLARE @new_department_id INT
		SET @new_department_id = (
			SELECT department_id
			FROM Department
            WHERE department_name = @new_department_name AND branch_id = @new_branch_id
		)

        UPDATE Staff
        SET department_id = @new_department_id
        WHERE staff_id = @staff_id;

        -- update work history
        UPDATE WorkHistory
        SET ending_date = GETDATE()
        WHERE staff_id = @staff_id AND ending_date IS NULL;

		-- create new work history
        INSERT INTO WorkHistory (staff_id, department_id, starting_date)
        VALUES (@staff_id, @new_department_id, GETDATE());

        COMMIT TRAN;

        PRINT N'Chuyển công tác thành công cho nhân viên ID: ' + CAST(@staff_id AS VARCHAR(10));
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRAN;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
-- 9. fetch staff data using name
GO
CREATE OR ALTER PROC sp_get_staff_info
    @staff_name NVARCHAR(50) = NULL,
    @page_number INT,
    @page_size INT
AS
BEGIN
    BEGIN TRY
        DECLARE @offset INT;

        SET @offset = (@page_number - 1) * @page_size;

        SELECT *
        FROM Staff
        WHERE (staff_name = @staff_name OR @staff_name is NULL)
        ORDER BY staff_id
        OFFSET @offset ROWS
        FETCH NEXT @page_size ROWS ONLY;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
-- 10. fetch branch rating:
GO
CREATE OR ALTER PROCEDURE sp_get_branch_ratings
    @branch_id VARCHAR(10) = NULL, -- NULL for all branches
    @page_number INT,
    @page_size INT
AS
BEGIN
    BEGIN TRY
        -- Declare variables for pagination
        DECLARE @offset INT = (@page_number - 1) * @page_size;

        -- Fetch branch ratings with optional branch filtering
        SELECT
            CR.branch_id,
            B.branch_name,
            CR.rating_id,
            CR.branch_rating -- Individual ratings
        FROM CustomerRating CR
        JOIN Branch B 
		ON CR.branch_id = B.branch_id
        WHERE (@branch_id IS NULL OR B.branch_id = @branch_id) -- Filter by branch_id if provided
        ORDER BY CR.branch_rating DESC -- Order by individual rating
        OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
    END TRY
    BEGIN CATCH
        -- Handle errors
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END;
GO
-- 11. fetch staff rating
GO
CREATE OR ALTER PROCEDURE sp_get_staff_ratings
    @page_number INT,
    @page_size INT
AS
BEGIN
    BEGIN TRY
        DECLARE @offset INT;
        SET @offset = (@page_number - 1) * @page_size;

        -- Fetch staff ratings with pagination
        SELECT
            S.staff_id,
            S.staff_name,
            AVG(CR.service_manner_rating) AS Rating
        FROM CustomerRating CR
        JOIN Staff S 
            ON CR.staff_id = S.staff_id
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
-- 12. fetch revenue by month, quarter, year of a branch
GO
CREATE OR ALTER PROCEDURE sp_get_branch_revenue_stats
    @start_date DATE,
    @end_date DATE,
    @branch_id VARCHAR(10) = NULL,  -- null for all branch
    @group_by NVARCHAR(10)  -- 'day', 'month', 'quarter', 'year'
AS
BEGIN
    BEGIN TRY
        DECLARE @dateFormat NVARCHAR(20);

        -- date format
        IF @group_by = 'day'
            SET @dateFormat = 'yyyy-MM-dd';
        ELSE IF @group_by = 'month'
            SET @dateFormat = 'yyyy-MM';
        ELSE IF @group_by = 'quarter'
            SET @dateFormat = 'yyyy-qq';
        ELSE IF @group_by = 'year'
            SET @dateFormat = 'yyyy';
        ELSE
            RAISERROR('Invalid groupBy parameter. Use "day", "month", "quarter", or "year".', 16, 1);

        SELECT 
            B.branch_name,
            FORMAT(O.order_datetime, @dateFormat) AS Period,
            SUM(Bi.subtotal) AS TotalRevenue,
            COUNT(O.order_id) AS TotalOrders
        FROM Bill Bi
        JOIN [Order] O ON Bi.order_id = O.order_id
        JOIN Branch B ON O.branch_id = B.branch_id
        WHERE O.order_datetime BETWEEN @start_date AND @end_date
            AND (@branch_id IS NULL OR B.branch_id = @branch_id)
        GROUP BY B.branch_name, FORMAT(O.order_datetime, @dateFormat)
        ORDER BY Period;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
-- 13. sales stats by each menu item
GO
CREATE OR ALTER PROCEDURE sp_get_menu_sales_stats
    @start_date DATE,
    @end_date DATE,
    @branch_id VARCHAR(10) = NULL,  -- null for all
    @region_id VARCHAR(10) = NULL   -- null for all
AS
BEGIN
    BEGIN TRY
        -- top 1 sale
        SELECT
            MI.item_name,
            SUM(OD.quantity * OD.unit_price) AS TotalRevenue,
            SUM(OD.quantity) AS TotalQuantitySold
        FROM OrderDetails OD
        JOIN [Order] O ON OD.order_id = O.order_id
        JOIN MenuItem MI ON OD.item_id = MI.item_id
        JOIN Branch B ON O.branch_id = B.branch_id
        WHERE O.order_datetime BETWEEN @start_date AND @end_date
            AND (@branch_id IS NULL OR B.branch_id = @branch_id)
            AND (@region_id IS NULL OR B.region_id = @region_id)
        GROUP BY MI.item_name
        ORDER BY TotalRevenue DESC;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

-- 14. Thêm món ăn vào trong MenuItem
GO
CREATE OR ALTER PROCEDURE sp_add_menu_item
    @item_name NVARCHAR(50),
    @description NVARCHAR(255) NULL,
    @base_price FLOAT,
    @status BIT,
    @category_id VARCHAR(10), 
	@image_url TEXT NULL
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra category_id có tồn tại trong MenuCategory không
        IF NOT EXISTS (SELECT 1 FROM MenuCategory WHERE category_id = @category_id)
        BEGIN
			RAISERROR('This category does not exist', 16, 1);
        END

        -- 2. Tạo ID mới cho món ăn dựa trên category_id
        DECLARE @new_item_id VARCHAR(10);
        DECLARE @numeric_part INT;

        -- Tách phần chữ và số trong item_id
        DECLARE @category_prefix VARCHAR(10);
        SET @category_prefix = @category_id;

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
        VALUES(@new_item_id, @item_name, @description, @base_price, 
               CASE WHEN @status = 1 THEN 'available' ELSE 'unavailable' END, @image_url);

        -- 4. Thêm liên kết danh mục vào bảng MenuItemCategory
        INSERT INTO MenuItemCategory(item_id, category_id)
        VALUES(@new_item_id, @category_id);


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
--EXEC sp_add_menu N'UDON XÀO XÁO XAO', NULL, 22000, 0, 'ND', NULL;

-- 15. xóa món ăn ra khỏi menu item
GO
CREATE OR ALTER PROCEDURE sp_delete_menu_item
    @item_id VARCHAR(10)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra có tồn tại item_id này trong MenuItem
        IF NOT EXISTS (SELECT 1 FROM MenuItem WHERE item_id = @item_id)
        BEGIN
			RAISERROR('This item id does not exist.', 16, 1);
        END

        -- 2. Xóa tất cả các liên kết trong MenuItemCategory và BranchMenuItem
        DELETE FROM MenuItemCategory WHERE item_id = @item_id;
        DELETE FROM BranchMenuItem WHERE item_id = @item_id;

        -- 3. Xóa món ăn khỏi MenuItem
        DELETE FROM MenuItem WHERE item_id = @item_id;

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
--EXEC sp_delete_MenuItem 'ND14';

-- 16. thêm combo món ăn
GO
CREATE TYPE ItemIdTable AS TABLE (
    item_id VARCHAR(10)
);
GO

GO
CREATE OR ALTER PROCEDURE sp_add_combo
    @combo_name NVARCHAR(50),
    @combo_description NVARCHAR(255) = NULL,
    @item_ids ItemIdTable READONLY -- Accepts the table-valued parameter
AS
BEGIN
    DECLARE @new_combo_id VARCHAR(10);

    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Generate new combo_id (e.g., COMBO1, COMBO2, ...)
        SET @new_combo_id = 'COMBO' + CAST(
            (SELECT ISNULL(MAX(CAST(SUBSTRING(combo_id, 6, LEN(combo_id)) AS INT)), 0) + 1 FROM Combo) 
            AS VARCHAR(3));

        -- 2. Insert the new combo into the Combo table
        INSERT INTO Combo (combo_id, combo_name, combo_description)
        VALUES (@new_combo_id, @combo_name, @combo_description);

        -- 3. Validate and insert items into ComboMenuItem
        INSERT INTO ComboMenuItem (combo_id, item_id)
        SELECT @new_combo_id, item_id
        FROM @item_ids AS ids
        WHERE EXISTS (SELECT 1 FROM MenuItem WHERE item_id = ids.item_id);

        -- Check if any item_id was invalid
        IF EXISTS (
            SELECT item_id 
            FROM @item_ids
            WHERE NOT EXISTS (SELECT 1 FROM MenuItem WHERE item_id = item_id)
        )
        BEGIN
            RAISERROR('One or more item_ids do not exist in MenuItem.', 16, 1);
        END

        -- Commit transaction if everything succeeds
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback transaction on error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Re-raise the error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

/* TEST HERE
-- Create a table variable of type ItemIdTable
DECLARE @item_ids ItemIdTable;

-- Insert item_id values into the table variable
INSERT INTO @item_ids (item_id)
VALUES ('A1'), ('B2'), ('BE1');

-- Call the procedure
EXEC sp_add_combo
    @combo_name = 'Deluxe Combo',
    @combo_description = 'A delicious combination of menu items.',
    @item_ids = @item_ids;


SELECT * FROM Combo;
SELECT * FROM ComboMenuItem;
*/

-- 17. Xóa combo ra khỏi hệ thống
GO
CREATE OR ALTER PROCEDURE sp_delete_combo
    @combo_id VARCHAR(10)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Kiểm tra xem combo có tồn tại trong bảng Combo hay không
        IF NOT EXISTS (SELECT 1 FROM Combo WHERE combo_id = @combo_id)
        BEGIN
            RAISERROR('This combo does not exist', 16, 1);
        END

        -- 2. Xóa các item liên quan đến combo trong ComboMenuItem
        DELETE FROM ComboMenuItem WHERE combo_id = @combo_id;

        -- 3. Xóa combo khỏi bảng Combo
        DELETE FROM Combo WHERE combo_id = @combo_id;


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


-- 19. xem tất cả các món có trong cơ sở dữ liệu
GO
CREATE OR ALTER PROCEDURE sp_get_menu_item_list
    @page_number INT,
    @page_size INT
AS
BEGIN
    BEGIN TRY
        -- Declare variables for pagination
        DECLARE @offset INT = (@page_number - 1) * @page_size;

		-- Find number of menu items
		DECLARE @total_page int;
		SET @total_page = (
			SELECT COUNT(*) AS 'row_num'
				FROM MenuItem MI
				JOIN MenuItemCategory MIC
				ON MIC.item_id = MI.item_id
				JOIN MenuCategory MC
				ON MC.category_id = MIC.category_id)
        
		-- Fetch menu item with category_name
		SELECT MI.*, MC.category_name, @total_page AS 'row_num'
			FROM MenuItem MI
			JOIN MenuItemCategory MIC
			ON MIC.item_id = MI.item_id
			JOIN MenuCategory MC
			ON MC.category_id = MIC.category_id
		ORDER BY MI.item_id ASC
		OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
    END TRY
    BEGIN CATCH
        -- Handle errors
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END;