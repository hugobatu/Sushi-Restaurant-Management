GO
USE SushiXRestaurant
SELECT * FROM Region
SELECT * FROM Branch
select * from [Table]
select * from MenuItem
select * from MenuCategory
select * from MenuItemCategory
select * from Department
select * from Staff
select * from WorkHistory

-- Thêm một khu vực mới
EXEC sp_add_new_region N'Thành Phố Hồ Chí Minh'
EXEC sp_add_new_region N'Đà Lạt'
EXEC sp_add_new_region N'Khánh Hòa'
EXEC sp_add_new_region N'Đà Nẵng'
EXEC sp_add_new_region N'hà nội'

-- Gọi stored procedure để thêm chi nhánh vào bảng Branch
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
    @region_id = 'tphcm', 
    @branch_name = N'Nguyễn Văn Cừ',
    @branch_address = N'456 Nguyễn Văn Cừ', 
    @opening_time = '09:00', 
    @closing_time = '21:00', 
    @phone_number = '0987654321', 
    @has_bike_parking_lot = 1,
    @has_car_parking_lot = 1;

EXEC sp_add_new_branch 
    @region_id = 'NT', 
    @branch_name = N'South Branch', 
    @branch_address = N'789 South Road, Ho Chi Minh City', 
    @opening_time = '10:00', 
    @closing_time = '23:00', 
    @phone_number = '0912345678', 
    @has_bike_parking_lot = 0, 
    @has_car_parking_lot = 1;

EXEC sp_add_new_branch 
    @region_id = 'R002', 
    @branch_name = N'East Branch', 
    @branch_address = N'101 East Street, Hai Phong', 
    @opening_time = '07:00', 
    @closing_time = '20:00', 
    @phone_number = '0923456789', 
    @has_bike_parking_lot = 1, 
    @has_car_parking_lot = 0;

EXEC sp_add_new_branch 
    @region_id = 'R003', 
    @branch_name = N'Western Branch', 
    @branch_address = N'202 West Road, Da Nang', 
    @opening_time = '08:30', 
    @closing_time = '21:30', 
    @phone_number = '0934567890', 
    @has_bike_parking_lot = 1, 
    @has_car_parking_lot = 1;


-- 1. Test Staff Data for Multiple Staff
GO
DECLARE @department_id VARCHAR(10) = 'D001';  -- Assuming this department exists
DECLARE @branch_id VARCHAR(10) = 'B001';  -- Assuming this branch exists

-- Staff 1
EXEC sp_add_staff 
    'B001',
    @department_name = 'manager',
    @staff_name = 'Jane Smith',
	@birth_date = '2004/05/25',
    @gender = 'MaLe',
    @join_date = '2023-11-15';

-- Staff 2
EXEC sp_add_staff 'B002', 'manager', N'Lebron James', '2004/05/25', 'MaLe', '2023-11-15';

-- Staff 3
EXEC sp_add_staff 
    @branch_id = @branch_id,
    @staff_name = 'Lucy Brown', 
    @staff_position = 'Cleaner', 
    @department_id = 'DPT003',
    @phone_number = '0123456783', 
    @hire_date = '2024-05-01';

-- testing firing
EXEC sp_fire_staff 5
SELECT * FROM Staff
SELECT * FROM WorkHistory
SELECT * FROM Department	
-- testing transfering
EXEC sp_transfer_staff 5, 'b002', 'chef'

-- fetch branch rating