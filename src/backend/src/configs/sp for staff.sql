GO
USE SushiXRestaurant


-- 1. thêm khách hàng
GO
CREATE OR ALTER PROC sp_add_customer_info
	@customer_name NVARCHAR(50),
	@email VARCHAR(50),
	@phone_number VARCHAR(10),
	@gender NVARCHAR(10),
	@birth_date DATE,
	@id_number VARCHAR(12)
AS
BEGIN
	BEGIN TRY
		BEGIN TRAN
		IF EXISTS (
			SELECT 1
			FROM Customer
			WHERE customer_name = @customer_name OR email = @email OR id_number = @id_number
		)
		BEGIN
			RAISERROR('This customer has existed', 16, 1)
		END

        DECLARE @new_customer_id INT = SCOPE_IDENTITY();
		INSERT INTO Customer(customer_id, customer_name, email, phone_number, gender, birth_date)
		VALUES (@new_customer_id, @customer_name, @email, @phone_number, @gender, @birth_date)
		COMMIT TRAN
		PRINT 'Add new customer successfully with' + CAST(@new_customer_id AS NVARCHAR)
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRAN
		
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH
END
