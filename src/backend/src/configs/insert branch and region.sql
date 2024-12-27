GO
USE SushiXRestaurant
SELECT * FROM Region
SELECT * FROM Branch
select * from [Table]
select * from MenuItem
select * from MenuCategory
select * from MenuItemCategory
select * from Department
select * from WorkHistory
select * from Staff
select * from Account
-- Thêm một khu vực mới
EXEC sp_add_region N'Thành Phố Hồ Chí Minh'
EXEC sp_add_region N'Đà Lạt'
EXEC sp_add_region N'Khánh Hòa'
EXEC sp_add_region N'Nha Trang'
EXEC sp_add_region N'Đà Nẵng'
EXEC sp_add_region N'Hà Nội'
-- Kiểm tra menu của chi nhánh B002
SELECT * FROM BranchMenuItem WHERE branch_id = 'B002'

-- Kiểm tra nhân viên của chi nhánh B002
SELECT * FROM Staff JOIN Department ON Department.department_id = Staff.department_id AND Department.branch_id = 'B001'
SELECT * FROM Staff JOIN Department ON Department.department_id = Staff.department_id AND Department.branch_id = 'B002'

-- Gọi stored procedure để thêm nhân viên chi nhánh vào bảng Branch
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
    @branch_name = N'Tokyo Deli Komodo', 
    @branch_address = N'789 đường biển', 
    @opening_time = '10:00',
    @closing_time = '23:00', 
    @phone_number = '0912345678',
    @has_bike_parking_lot = 0, 
    @has_car_parking_lot = 1;

-- chỉnh sửa thông tin chi nhánh
EXEC sp_update_branch_status 'B001', 'closed', 1, 1

-- thêm nhân viên bằng api viết trong ORM


-- testing firing
EXEC sp_fire_staff 9
SELECT * FROM Staff
SELECT * FROM WorkHistory
SELECT * FROM Department	
-- testing transfering
EXEC sp_transfer_staff 5, 'b002', 'chef'
-- testing update salary
EXEC sp_update_staff_salary 19, 0.1
-- fetch branch rating