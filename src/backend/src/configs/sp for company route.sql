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

        -- generate region_id from the initials of the region_name
        DECLARE @new_region_id VARCHAR(10);
        SELECT @new_region_id = STRING_AGG(LEFT(value, 1), '')
        FROM STRING_SPLIT(@region_name, ' ');

        -- check in case another region id has existed
        IF EXISTS (
            SELECT 1
            FROM Region
            WHERE region_id = @new_region_id
        )
        BEGIN
            RAISERROR('Region ID already exists in the database.', 16, 1);
        END

        -- insert the new region
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
        -- handle error
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

        -- Handle the error
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
            @new_branch_id, UPPER(@region_id), UPPER(@branch_name), @branch_address, 
            @opening_time, @closing_time, @phone_number,
            @has_bike_parking_lot, @has_car_parking_lot
        );

		-- copying menu to new branch
		INSERT INTO BranchMenuItem (branch_id, item_id, is_available)
		SELECT @new_branch_id, item_id, 1
		FROM MenuItem
		-- auto add table
		EXEC sp_add_table @new_branch_id, @num_tables = 20, @capacity = 4
		INSERT INTO Department(branch_id, department_name, base_salary) VALUES
		(@new_branch_id, 'Chef', 20000000),
		(@new_branch_id, 'Manager', 18000000),
		(@new_branch_id, 'Staff', 15000000),
		(@new_branch_id, 'Security', 12000000)
		COMMIT TRAN
		-- auto add Department
        PRINT 'Branch added successfully with ID: ' + @new_branch_id;
    END TRY
    BEGIN CATCH
		IF (@@TRANCOUNT > 0)
		BEGIN
			ROLLBACK TRAN;
		END
        -- handle and re-raise the error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
-- 3. update branch status (working/closed/maintenance)
GO
CREATE OR ALTER PROC sp_update_branch_status
    @branch_id VARCHAR(10),
    @new_status NVARCHAR(50)
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

        -- update the branch status
        UPDATE Branch
        SET branch_status = @new_status
        WHERE branch_id = UPPER(@branch_id);

		COMMIT TRAN

        PRINT 'Branch status updated successfully.';
    END TRY
    BEGIN CATCH
		IF (@@TRANCOUNT > 0)
		BEGIN
			ROLLBACK TRAN;
		END
		-- bugs
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
-- 4. get all branch information
GO
CREATE OR ALTER PROC sp_get_branches_data
    @pageNumber INT,
    @pageSize INT
AS
BEGIN
    DECLARE @offset INT;

    SET @offset = (@pageNumber - 1) * @pageSize;

    SELECT *
    FROM Branch
    ORDER BY branch_id
    OFFSET @offset ROWS
    FETCH NEXT @pageSize ROWS ONLY;
END

-- 5. add a new staff
GO
CREATE OR ALTER PROCEDURE sp_add_staff
    @branch_id VARCHAR(10),
    @department_name NVARCHAR(50),
    @staff_name NVARCHAR(50),
    @birth_date DATE,
    @gender NVARCHAR(10),
    @join_date DATE,
    @staff_status NVARCHAR(20) = N'active', -- default is 'active'
    @username VARCHAR(50) = NULL -- optional
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN;

        -- Check if branch exists
        IF NOT EXISTS (SELECT 1 FROM Branch WHERE branch_id = UPPER(@branch_id))
        BEGIN
            RAISERROR('Branch does not exist.', 16, 1);
            RETURN;
        END;

        -- Check if department exists
        IF NOT EXISTS (SELECT 1 
                       FROM Department 
                       WHERE department_name = UPPER(@department_name) 
                         AND branch_id = @branch_id)
        BEGIN
            RAISERROR('Department does not exist.', 16, 1);
            RETURN;
        END;

        -- Validate gender
        IF LOWER(@gender) NOT IN (N'male', N'female')
        BEGIN
            RAISERROR('Invalid gender value. Use "male" or "female".', 16, 1);
            RETURN;
        END;

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

        ---- If the staff is a manager, generate and insert an account
        --IF UPPER(@department_name) = 'MANAGER'
        --BEGIN
        --    -- Generate staff initials
        --    DECLARE @staff_initials VARCHAR(10);
        --    SELECT @staff_initials = STRING_AGG(LEFT(value, 1), '')
        --    FROM STRING_SPLIT(UPPER(@staff_name), ' ');

        --    -- Handle duplicates
        --    DECLARE @existing_count INT = (
        --        SELECT COUNT(*)
        --        FROM Account
        --        WHERE username LIKE @staff_initials + '%'
        --    );

        --    -- unique username
        --    IF @existing_count = 0
        --        SET @username = @staff_initials;
        --    ELSE
        --        SET @username = @staff_initials + CAST(@existing_count + 1 AS VARCHAR);

        --    -- Insert into Account table
        --    INSERT INTO Account (username, account_type, account_status)
        --    VALUES (@username, 'manager', 'active');
        --END;

        -- Insert new staff record
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
END;

-- 6. sa thải nhân viên
GO
CREATE OR ALTER PROCEDURE sp_fire_staff
    @staff_id INT -- Assuming staff_id is INT, change to VARCHAR(10) if necessary
AS
BEGIN
    BEGIN TRY
        BEGIN TRAN;

        -- 1. Check existence
        IF NOT EXISTS (
            SELECT 1 
            FROM Staff
            WHERE staff_id = @staff_id
        )
        BEGIN
            RAISERROR(N'This staff does not exist.', 16, 1);
            RETURN;
        END;

        -- 2. Check if the staff has already been fired
        IF EXISTS (
            SELECT 1
            FROM Staff
            WHERE staff_id = @staff_id AND staff_status = N'resigned'
        )
        BEGIN
            RAISERROR(N'This staff has already been fired.', 16, 1);
            RETURN;
        END;

        -- 3. Update staff status to 'resigned'
        UPDATE Staff
        SET staff_status = N'resigned'
        WHERE staff_id = @staff_id;

        -- 4. Update the latest work history record
        UPDATE WorkHistory
        SET ending_date = GETDATE()
        WHERE staff_id = @staff_id 
          AND ending_date IS NULL;

        COMMIT TRAN;

        PRINT N'Firing successfully completed.';
    END TRY
    BEGIN CATCH
        IF (@@TRANCOUNT > 0)
            ROLLBACK TRAN;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END;


-- 7. update salary for staff or deparment
GO
CREATE OR ALTER PROCEDURE sp_update_staff_salary
    @staff_id INT = NULL,              -- Staff ID (optional)
    @department_id VARCHAR(10) = NULL, -- Department ID (optional)
    @increase_rate FLOAT = 0.1         -- Increase rate (default is 10%)
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

        -- Update salary for a specific staff member
        IF @staff_id IS NOT NULL
        BEGIN
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
        END

        -- Update salary for all staff in a department
        IF @department_id IS NOT NULL
        BEGIN
            -- Check if the department exists
            IF NOT EXISTS (
                SELECT 1 
                FROM Department 
                WHERE department_id = @department_id
            )
            BEGIN
                RAISERROR(N'This department does not exist.', 16, 1);
                RETURN;
            END

            -- Update salary for active staff in the department
            UPDATE Staff
            SET salary = salary * (1 + @increase_rate)
            WHERE department_id = @department_id AND staff_status = N'active';
        END

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
		-- check existence of new branch
        IF NOT EXISTS (
            SELECT 1 
            FROM Branch 
            WHERE branch_id = @new_branch_id
        )
        BEGIN
            RAISERROR(N'Chi nhánh mới không tồn tại.', 16, 1);
        END;

		-- check existence of new department
        IF NOT EXISTS (
            SELECT 1 
            FROM Department
            WHERE department_name = @new_department_name AND branch_id = @new_branch_id
        )
        BEGIN
            RAISERROR(N'Phòng ban mới không tồn tại trong chi nhánh mới.', 16, 1);
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

        PRINT N'Chuyển công tác thành công cho nhân viên ID: ' + CAST(@staff_id AS INT);
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

-- 9. fetch staff data using name
GO
CREATE OR ALTER PROC sp_get_staff_info
    @staff_name NVARCHAR(50) = NULL,
    @pageNumber INT,
    @pageSize INT
AS
BEGIN
    BEGIN TRY
        DECLARE @offset INT;

        SET @offset = (@pageNumber - 1) * @pageSize;

        SELECT *
        FROM Staff
        WHERE staff_name = @staff_name
        ORDER BY staff_id
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY;
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
    @pageNumber INT,
    @pageSize INT
AS
BEGIN
    BEGIN TRY
        DECLARE @offset INT;

        SET @offset = (@pageNumber - 1) * @pageSize;

        SELECT
            B.branch_name,
            AVG(
                COALESCE(branch_rating, 0) +
                COALESCE(food_quality_rating, 0) +
                COALESCE(price_rating, 0) +
                COALESCE(surroundings_rating, 0)
            ) / 4.0 AS BranchRating,
            COUNT(CR.rating_id) AS TotalRatings
        FROM CustomerRating CR
        JOIN Branch B ON CR.branch_id = B.branch_id
        GROUP BY B.branch_id, B.branch_name
        ORDER BY BranchRating DESC, TotalRatings DESC
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY;
    END TRY
    BEGIN CATCH
        -- Handle errors
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END

-- 11. fetch staff rating
GO
CREATE OR ALTER PROCEDURE sp_get_staff_ratings
    @pageNumber INT,
    @pageSize INT
AS
BEGIN
    BEGIN TRY
        DECLARE @offset INT;
		SET @offset = (@pageNumber - 1) * @pageSize;

        SELECT
            S.staff_name,
            AVG(CR.service_manner_rating) AS StaffRating,
            COUNT(CR.rating_id) AS TotalRatings
        FROM CustomerRating CR
        JOIN Staff S ON CR.staff_id = S.staff_id
        GROUP BY S.staff_id, S.staff_name
        ORDER BY StaffRating DESC, TotalRatings DESC
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY;
    END TRY
    BEGIN CATCH
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
    @startDate DATETIME,
    @endDate DATETIME,
    @branchId INT = NULL,  -- null for all branch
    @groupBy NVARCHAR(10)  -- 'day', 'month', 'quarter', 'year'
AS
BEGIN
    BEGIN TRY
        DECLARE @dateFormat NVARCHAR(20);

        -- date format
        IF @groupBy = 'day'
            SET @dateFormat = 'yyyy-MM-dd';
        ELSE IF @groupBy = 'month'
            SET @dateFormat = 'yyyy-MM';
        ELSE IF @groupBy = 'quarter'
            SET @dateFormat = 'yyyy-qq';
        ELSE IF @groupBy = 'year'
            SET @dateFormat = 'yyyy';
        ELSE
            RAISERROR('Invalid groupBy parameter. Use "day", "month", "quarter", or "year".', 16, 1);

        SELECT 
            B.branch_name,
            FORMAT(O.order_date, @dateFormat) AS Period,
            SUM(OD.quantity * OD.price) AS TotalRevenue,
            COUNT(O.order_id) AS TotalOrders
        FROM OrderDetails OD
        JOIN Orders O ON OD.order_id = O.order_id
        JOIN Branch B ON O.branch_id = B.branch_id
        WHERE O.order_date BETWEEN @startDate AND @endDate
            AND (@branchId IS NULL OR B.branch_id = @branchId)
        GROUP BY B.branch_name, FORMAT(O.order_date, @dateFormat)
        ORDER BY Period;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
-- 13. sales stats by each menu item
GO
CREATE OR ALTER PROCEDURE sp_get_menu_sales_stats
    @startDate DATETIME,
    @endDate DATETIME,
    @branchId INT = NULL,  -- null for all
    @regionId INT = NULL   -- null for all
AS
BEGIN
    BEGIN TRY
        -- top 1 sale
        SELECT TOP 1
            MI.menu_item_name,
            SUM(OD.quantity * OD.price) AS TotalRevenue,
            SUM(OD.quantity) AS TotalQuantitySold
        FROM OrderDetails OD
        JOIN Orders O ON OD.order_id = O.order_id
        JOIN MenuItems MI ON OD.menu_item_id = MI.menu_item_id
        JOIN Branch B ON O.branch_id = B.branch_id
        WHERE O.order_date BETWEEN @startDate AND @endDate
            AND (@branchId IS NULL OR B.branch_id = @branchId)
            AND (@regionId IS NULL OR B.region_id = @regionId)
        GROUP BY MI.menu_item_name
        ORDER BY TotalRevenue DESC;

        -- bot 1 sale
        SELECT TOP 1
            MI.menu_item_name,
            SUM(OD.quantity * OD.price) AS TotalRevenue,
            SUM(OD.quantity) AS TotalQuantitySold
        FROM OrderDetails OD
        JOIN Orders O ON OD.order_id = O.order_id
        JOIN MenuItems MI ON OD.menu_item_id = MI.menu_item_id
        JOIN Branch B ON O.branch_id = B.branch_id
        WHERE O.order_date BETWEEN @startDate AND @endDate
            AND (@branchId IS NULL OR B.branch_id = @branchId)
            AND (@regionId IS NULL OR B.region_id = @regionId)
        GROUP BY MI.menu_item_name
        ORDER BY TotalRevenue ASC;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;