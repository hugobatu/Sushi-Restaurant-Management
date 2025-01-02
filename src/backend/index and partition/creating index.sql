GO
USE SushiXRestaurant

-- 1.
CREATE NONCLUSTERED INDEX IDX_Order_BranchId ON [Order](branch_id);
CREATE NONCLUSTERED INDEX IDX_Bill_OrderId ON Bill(order_id);


-- 2.
CREATE NONCLUSTERED INDEX IDX_CustomerRating_BranchId ON CustomerRating(branch_id);

-- 3.
CREATE NONCLUSTERED INDEX IDX_CustomerRating_StaffId ON CustomerRating (staff_id);

-- 4.
CREATE NONCLUSTERED INDEX IDX_Branch_RegionId ON Branch(region_id);

-- 5.
CREATE NONCLUSTERED INDEX IDX_Staff_DepartmentId ON Staff(department_id);
CREATE NONCLUSTERED INDEX IDX_Department_BranchId ON Department(branch_id);

-- 6.
CREATE NONCLUSTERED INDEX IDX_Membership_CustomerId ON Membership(customer_id);
CREATE NONCLUSTERED INDEX IDX_Customer_PhoneNumber ON Customer(phone_number);
