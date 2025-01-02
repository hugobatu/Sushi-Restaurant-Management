GO
USE SushiXRestaurant


-- 1. xem doanh thu tất cả chi nhánh, thứ tự thực thi: Branch -> Order -> Bill
exec sp_get_branch_revenue_stats '2020-01-01', '2024-01-01', null, 'month'

-- 2. 