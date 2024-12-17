GO
USE SushiXRestaurant

-- 1. get table status by branch
GO
CREATE OR ALTER PROCEDURE sp_get_tables_status_by_branch
    @branch_id VARCHAR(10)
AS
BEGIN
    BEGIN TRY
        SELECT 
            T.table_id,
            T.branch_id,
            T.is_available,
            B.branch_name
        FROM [Table] T
        JOIN Branch B ON T.branch_id = B.branch_id
        WHERE T.branch_id = @branch_id
        ORDER BY T.table_id;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;

-- 4. add customer
GO
CREATE OR ALTER PROC sp_add_customer
	@customer_name NVARCHAR(50),
	@email VARCHAR(50),
	@phone_number VARCHAR(10),
	@gender NVARCHAR(10),
	@birth_date DATE,
	@id_number VARCHAR(12)
AS
BEGIN
	BEGIN TRY
		BEGIN TRAN;

		INSERT INTO Customer (customer_name, email, phone_number, gender, birth_date, id_number)
		VALUES (@customer_name, @email, @phone_number, @gender, @birth_date, @id_number);

		DECLARE @new_customer_id INT = SCOPE_IDENTITY();

		COMMIT TRAN;

		PRINT 'Customer added successfully with ID: ' + CAST(@new_customer_id AS NVARCHAR(50));
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRAN;

		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
		DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
		DECLARE @ErrorState INT = ERROR_STATE();

		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH
END
-- 5. view customer list at that branch
GO
CREATE OR ALTER PROC sp_view_customer_by_branch
	@branch_id VARCHAR(10)
AS
BEGIN
	BEGIN TRY
		SELECT * 
		FROM Staff S
		JOIN Department D
		ON D.department_id = S.department_id
		WHERE D.branch_id = @branch_id
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRAN;

		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
		DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
		DECLARE @ErrorState INT = ERROR_STATE();

		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH
END

-- 6. 