GO
USE SushiXRestaurant


-- 1. xem doanh thu tất cả chi nhánh, thứ tự thực thi: Branch -> Order -> Bill
EXEC sp_get_branch_revenue_stats '2020-01-01', '2024-01-01', null, 'month'

-- 2. xem đánh giá chi nhánh
EXEC sp_get_branch_ratings null, 1, 100000

-- 3. xem đánh giá thái độ nhân viên
EXEC sp_get_staff_ratings 1, 100000	