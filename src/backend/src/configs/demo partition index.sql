GO
USE SushiXRestaurant


-- 1. xem doanh thu tất cả chi nhánh, thứ tự thực thi: Branch -> Order -> Bill
EXEC sp_get_branch_revenue_stats '2020-01-01', '2024-01-01', null, 'month'

-- 2. xem đánh giá chi nhánh
EXEC sp_get_branch_ratings null, 1, 100000

-- 3. xem đánh giá thái độ nhân viên
EXEC sp_get_staff_ratings 1, 100000	

-- 4. xem các món bán chạy nhất dựa vào mã khu vực/mã chi nhánh
EXEC sp_get_menu_sales_stats '2022-05-25', '2024-05-25', NULL, 'TPHCM'

-- 5. xem các đánh giá của nhân viên tại 1 chi nhánh cụ thể dựa vào mã của nhân viên quản lý
EXEC sp_get_branch_staff_ratings 15, 1, 100000

-- 6. xem hạng mức thẻ thành viên của khách hàng
EXEC sp_view_customer_points '0953316642'

SELECT * FROM Bill