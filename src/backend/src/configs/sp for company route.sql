GO
USE SushiXRestaurant

-- 1. getting information of all branches
GO
CREATE OR ALTER PROC sp_get_branches
AS
BEGIN
	SELECT * FROM Branch;
END

exec sp_get_branches

select * from Region
select * from Branch

INSERT INTO Branch (
    branch_id,
    region_id, 
    branch_address, 
    opening_time, 
    closing_time, 
    phone_number, 
    has_bike_parking_lot, 
    has_car_parking_lot
)
VALUES ('B1', 'R1', N'Thành phố Hồ Chí Minh', '08:00:00', '22:00:00', '0123456789', 1, 1);