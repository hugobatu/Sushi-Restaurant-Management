GO
USE SushiXRestaurant

-- insert 5 khu vực
EXEC sp_add_region N'Thành Phố Hồ Chí Minh'
EXEC sp_add_region N'Hà Nội'
EXEC sp_add_region N'Đà Nẵng'
EXEC sp_add_region N'Khánh Hòa'
EXEC sp_add_region N'Nha Trang'
select * from Region

-- insert 10 chi nhánh
EXEC sp_add_new_branch
    @region_id = 'TPHCM', 
    @branch_name = N'Tekashimaya quận 1', 
    @branch_address = N'123 đồng khởi', 
    @opening_time = '08:00',
    @closing_time = '22:00', 
    @phone_number = '0123456789',
    @has_bike_parking_lot = 1,
    @has_car_parking_lot = 1;

EXEC sp_add_new_branch 
    @region_id = 'TPHCM',
    @branch_name = N'Nguyễn Văn Cừ',
    @branch_address = N'456 Nguyễn Văn Cừ', 
    @opening_time = '09:00', 
    @closing_time = '21:00', 
    @phone_number = '0987654321', 
    @has_bike_parking_lot = 1,
    @has_car_parking_lot = 1;

EXEC sp_add_new_branch 
    @region_id = 'NT', 
    @branch_name = N'Tokyo Deli Komodo', 
    @branch_address = N'789 đường biển', 
    @opening_time = '10:00',
    @closing_time = '23:00', 
    @phone_number = '0912345678',
    @has_bike_parking_lot = 0, 
    @has_car_parking_lot = 1;

	-- Thêm chi nhánh
EXEC sp_add_new_branch 
    @region_id = 'HN', 
    @branch_name = N'Vincom Bà Triệu', 
    @branch_address = N'191 Bà Triệu', 
    @opening_time = '08:30', 
    @closing_time = '22:30', 
    @phone_number = '0977777888', 
    @has_bike_parking_lot = 1, 
    @has_car_parking_lot = 1;

EXEC sp_add_new_branch 
    @region_id = N'ĐN',
    @branch_name = N'Hàn River Center', 
    @branch_address = N'50 Nguyễn Văn Linh', 
    @opening_time = '08:00', 
    @closing_time = '23:00', 
    @phone_number = '0944444555', 
    @has_bike_parking_lot = 1, 
    @has_car_parking_lot = 1;

EXEC sp_add_new_branch 
    @region_id = 'KH', 
    @branch_name = N'Tokyo Deli Đà Nẵng Cầu Rồng', 
    @branch_address = N'20 Nguyễn Đình Chiểu Đà Nẵng',
    @opening_time = '09:00', 
    @closing_time = '22:00', 
    @phone_number = '0933333222', 
    @has_bike_parking_lot = 0, 
    @has_car_parking_lot = 1;

EXEC sp_add_new_branch 
    @region_id = 'NT', 
    @branch_name = N'Nha Trang Center', 
    @branch_address = N'20 Trần Phú', 
    @opening_time = '10:00', 
    @closing_time = '22:00', 
    @phone_number = '0922222111', 
    @has_bike_parking_lot = 1, 
    @has_car_parking_lot = 1;

EXEC sp_add_new_branch 
    @region_id = 'NT',
    @branch_name = N'Sense City Nha Trang',
    @branch_address = N'1 Hòa Bình', 
    @opening_time = '09:30', 
    @closing_time = '22:00', 
    @phone_number = '0911111222', 
    @has_bike_parking_lot = 1, 
    @has_car_parking_lot = 0;

EXEC sp_add_new_branch 
    @region_id = 'HN', 
    @branch_name = N'Royal City', 
    @branch_address = N'72A Nguyễn Trãi', 
    @opening_time = '09:00', 
    @closing_time = '22:30', 
    @phone_number = '0909090909', 
    @has_bike_parking_lot = 1, 
    @has_car_parking_lot = 1;

EXEC sp_add_new_branch 
    @region_id = 'TPHCM', 
    @branch_name = N'Landmark 81', 
    @branch_address = N'208 Nguyễn Hữu Cảnh', 
    @opening_time = '08:00', 
    @closing_time = '23:00', 
    @phone_number = '0888888888', 
    @has_bike_parking_lot = 1, 
    @has_car_parking_lot = 1;

select * from Staff
left join Department
on Staff.department_id = Department.department_id
where department_name = 'manager' and branch_id = 'B010'

select * from Account where account_type = 'customer'
select * from Customer
select * from [Order] 
select * from Staff join Department on Staff.department_id = Department.department_id where staff_id = 15
SELECT * FROM CustomerRating
SELECT * FROM Bill

/*
delete from OrderDetails
delete from DirectServiceOrder
delete from [Order]
*/
