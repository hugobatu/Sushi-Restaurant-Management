GO
USE SushiXRestaurant
-- copy item from one branch menu to other
CREATE OR ALTER PROCEDURE sp_copy_menu
    @new_branch_id VARCHAR(10),
    @branch_id VARCHAR(10)
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (
			SELECT 1
			FROM Branch
			WHERE branch_id = @branch_id
		)
		BEGIN
			RAISERROR('Branch id not found', 16, 1);
			RETURN;
		END
		
		INSERT INTO BranchMenuItem (branch_id, item_id, is_available)
		SELECT @new_branch_id, item_id, 1
		FROM BranchMenuItem
		WHERE branch_id = @branch_id;

		
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH
END;
-- auto add table to branch
CREATE OR ALTER PROCEDURE sp_add_default_tables
    @branch_id VARCHAR(10),
    @num_tables INT = 10,
    @capacity INT = 4
AS
BEGIN
	BEGIN TRY
		-- checking branch
		IF NOT EXISTS (
			SELECT 1
			FROM Branch
			WHERE branch_id = @branch_id
		)
		BEGIN
			RAISERROR('Branch id cannot be found.', 16, 1);
			RETURN;
		END
		-- checking table
        IF EXISTS (
            SELECT 1
            FROM [Table]
            WHERE branch_id = @branch_id
        )
        BEGIN
            RAISERROR('Tables already exist for this branch.', 16, 1);
            RETURN;
        END;

		DECLARE @i INT = 1;
		WHILE @i <= @num_tables
		BEGIN
			INSERT INTO [Table] (table_id, branch_id, capacity, is_available)
			VALUES ('TABLE' + RIGHT('000' + CAST(@i AS VARCHAR), 3), @branch_id, @capacity, 1);
			SET @i = @i + 1;
		END;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH
END;
