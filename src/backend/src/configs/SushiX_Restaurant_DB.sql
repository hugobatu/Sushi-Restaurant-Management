IF DB_ID('SushiXRestaurant') IS NOT NULL
BEGIN
	USE MASTER;
	ALTER DATABASE SushiXRestaurant SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
	DROP DATABASE SushiXRestaurant;
END

GO
CREATE DATABASE SushiXRestaurant;

GO
USE SushiXRestaurant;



-- Region
GO
CREATE TABLE Region (
	region_id CHAR(10) ,
	region_name NVARCHAR(50),
	PRIMARY KEY (region_id)
);
-- Branch
GO
CREATE TABLE Branch (
	branch_id CHAR(10) ,
	region_id CHAR(10)  NOT NULL,
	branch_address NVARCHAR(50),
	opening_time TIME,
	closing_time TIME,
	phone_number VARCHAR(10),
	has_bike_parking_lot BIT DEFAULT 0,
	has_car_parking_lot BIT DEFAULT 0,
	PRIMARY KEY (branch_id),
	FOREIGN KEY (region_id) REFERENCES Region(region_id)
);
-- Table
GO
CREATE TABLE rTable (
	table_id CHAR(10) ,
	branch_id CHAR(10) ,
	capacity INT,
	is_available BIT DEFAULT 1,
	PRIMARY KEY (table_id),
	FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);
-- Department
GO
CREATE TABLE Department (
	department_id CHAR(10) ,
	department_name NVARCHAR(50),
	base_salary FLOAT,
	PRIMARY KEY (department_id),
);
-- Staff
GO
CREATE TABLE Staff (
	staff_id CHAR(10) ,
	branch_id CHAR(10) , --FK
	department_id CHAR(10) , --FK
	staff_name NVARCHAR(50),
	birth_date DATE,
	gender NVARCHAR(10) CHECK (gender IN (N'Nam', N'Nữ')),
	salary FLOAT,
	join_date DATE,
	resign_date DATE,
	staff_status NVARCHAR(20),
	PRIMARY KEY (staff_id),
	FOREIGN KEY (branch_id) REFERENCES Branch(branch_id),
	FOREIGN KEY (department_id) REFERENCES Department(department_id)
);
-- Work history
GO
CREATE TABLE WorkHistory(
	staff_id CHAR(10) ,
	department_id CHAR(10) ,
	starting_date DATE,
	ending_date DATE,
	PRIMARY KEY (staff_id, department_id),
	FOREIGN KEY (staff_id) REFERENCES Staff(staff_id),
	FOREIGN KEY (department_id) REFERENCES Department(department_id)
);
-- Menu item
GO
CREATE TABLE MenuItem (
    item_id CHAR(10),
    item_name NVARCHAR(50),
    menu_item_description NVARCHAR(100),
    base_price FLOAT NOT NULL,
    menu_item_status NVARCHAR(20),
	PRIMARY KEY (item_id)
);
-- Menu category
GO
CREATE TABLE MenuCategory (
    category_id CHAR(10),
    category_name NVARCHAR(50),
    menu_category_description NVARCHAR(100),
	PRIMARY KEY (category_id)
);
-- Menu item category (using for linking between menucategory and menu items)
GO
CREATE TABLE MenuItemCategory (
    item_id CHAR(10),
    category_id CHAR(10),
    PRIMARY KEY (item_id, category_id),
    FOREIGN KEY (item_id) REFERENCES MenuItem(item_id),
    FOREIGN KEY (category_id) REFERENCES MenuCategory(category_id)
);
-- Branch menu item link menu item to branch with availability
GO
CREATE TABLE BranchMenuItem (
    branch_id CHAR(10),
    item_id CHAR(10),
    is_available BIT DEFAULT 1,
    PRIMARY KEY (branch_id, item_id),
    FOREIGN KEY (branch_id) REFERENCES Branch(branch_id),
    FOREIGN KEY (item_id) REFERENCES MenuItem(item_id)
);
-- Combo
GO
CREATE TABLE Combo (
    combo_id CHAR(10) PRIMARY KEY,
    combo_name NVARCHAR(50),
    combo_description NVARCHAR(100)
);
-- Customer
GO
CREATE TABLE Customer (
	customer_id CHAR(10) ,
	customer_name NVARCHAR(50),
	email CHAR(50),
	phone_number CHAR(10),
	gender NVARCHAR(10) CHECK (gender IN (N'Nam', N'Nữ')),
	birth_date DATE NOT NULL,
	id_number CHAR(12) NOT NULL,
	PRIMARY KEY (customer_id)
);
-- Rating from customer
GO
CREATE TABLE CustomerRating (
	rating_id CHAR(10) ,
	customer_id CHAR(10) ,
	branch_id CHAR(10) ,
	service_manner_rating INT CHECK(service_manner_rating > 0 AND service_manner_rating <= 10),
	branch_rating INT CHECK(branch_rating > 0 AND branch_rating <= 10),
	food_quality_rating INT CHECK(food_quality_rating > 0 AND food_quality_rating <= 10),
	price_rating INT CHECK(price_rating > 0 AND price_rating <= 10),
	surroundings_rating INT CHECK(surroundings_rating > 0 AND surroundings_rating <= 10),
	personal_response NVARCHAR(100),
	PRIMARY KEY (rating_id),
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
	FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);
-- Order
GO
CREATE TABLE Ordering(
	order_id CHAR(10) ,
	customer_id CHAR(10) ,
	branch_id CHAR(10) ,
	order_datetime DATETIME,
	order_status NVARCHAR(20),
	PRIMARY KEY (order_id),
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
	FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);
-- Order details
GO
CREATE TABLE OrderDetails (
	order_id CHAR(10) ,
	item_id CHAR(10) ,
	quantity INT,
	unit_price FLOAT,
	PRIMARY KEY (order_id, item_id),
	FOREIGN KEY (order_id) REFERENCES Ordering(order_id),
	FOREIGN KEY (item_id) REFERENCES MenuItem(item_id)
);
-- Direct service order
GO
CREATE TABLE DirectServiceOrder (
	order_id CHAR(10) ,
	table_id CHAR(10) ,
	PRIMARY KEY (order_id, table_id),
	FOREIGN KEY (order_id) REFERENCES Ordering(order_id),
	FOREIGN KEY (table_id) REFERENCES rTable(table_id)
);
-- Delivery order
GO
CREATE TABLE DeliveryOrder (
	order_id CHAR(10) ,
	delivery_address NVARCHAR(50),
	delivery_fee FLOAT,
	PRIMARY KEY (order_id),
	FOREIGN KEY (order_id) REFERENCES Ordering(order_id)
);
-- Reservation order
GO
CREATE TABLE ReservationOrder (
	order_id CHAR(10) ,
	reservation_datetime DATETIME,
	num_guests INT,
	reservation_order_status NVARCHAR(20),
	PRIMARY KEY (order_id),
	FOREIGN KEY (order_id) REFERENCES Ordering(order_id)
);
-- Bill
GO
CREATE TABLE Bill (
	bill_id CHAR(10) ,
	order_id CHAR(10) ,
	subtotal FLOAT NOT NULL	,
	discount_amount FLOAT,
	tax_amount FLOAT,
	payment_method NVARCHAR(10),
	bill_date DATETIME,
	bill_status NVARCHAR(20),
	PRIMARY KEY (bill_id),
	FOREIGN KEY (order_id) REFERENCES Ordering(order_id)
);
-- Coupon giam gia
GO
CREATE TABLE Coupon (
	coupon_id CHAR(10) ,
	bill_id CHAR(10) ,
	coupon_code CHAR(10) ,
	discount_rate FLOAT NOT NULL,
	max_amount INT,
	valid_from DATETIME,
	valid_to DATETIME,
	coupon_status NVARCHAR(20),
	PRIMARY KEY (coupon_id),
	FOREIGN KEY (bill_id) REFERENCES Bill(bill_id)
);
-- promotion program
GO
CREATE TABLE PromotionProgram (
	program_id CHAR(10) ,
	coupon_id CHAR(10) ,
	promotion_program_name NVARCHAR(50),
	program_description NVARCHAR(100),
	starting_date DATETIME,
	end_date DATETIME,
	promotion_program_status NVARCHAR(20),
	PRIMARY KEY (program_id),
	FOREIGN KEY (coupon_id) REFERENCES Coupon(coupon_id)
);
-- Membership
GO
CREATE TABLE Membership(
	card_id CHAR(10) ,
	customer_id CHAR(10) ,
	issued_date DATE,
	valid_until DATE,
	points INT NOT NULL,
	membership_status NVARCHAR(20),
	PRIMARY KEY (card_id),
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);
-- membership level
GO
CREATE TABLE MembershipLevel (
	level_id CHAR(10) ,
	card_id CHAR(10),
	level_name NVARCHAR(20),
	discount_percentage FLOAT NOT NULL,
	min_points_required INT NOT NULL,
	min_spending FLOAT NOT NULL,
	maintenance_spending FLOAT,
	PRIMARY KEY (level_id),
	FOREIGN KEY (card_id) REFERENCES Membership(card_id)
);
-- account
CREATE TABLE Account (
    username CHAR(50) NOT NULL,
    customer_id CHAR(10) NULL,
    staff_id CHAR(10) NULL,
	password NVARCHAR(18) NOT NULL,
    account_type NVARCHAR(20) NOT NULL,
    account_status NVARCHAR(20) NOT NULL
	PRIMARY KEY (username),
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
	FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);

-- Users
GO
CREATE TABLE users (
	id INT IDENTITY(1,1) PRIMARY KEY,
	username NVARCHAR(100) NOT NULL UNIQUE,
	password NVARCHAR(100) NOT NULL,
	role NVARCHAR(20) CHECK (role IN ('customer', 'admin', 'branchManager')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- online connection
CREATE TABLE OnlineConnection (
    connection_id CHAR(10),
    username CHAR(50) NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME,
	PRIMARY KEY (connection_id),
    FOREIGN KEY (username) REFERENCES Account(username)
);
-- permission group
CREATE TABLE PermissionGroup (
    group_id CHAR(10) ,
    group_name NVARCHAR(50) NOT NULL ,
    permission_group_description NVARCHAR(50),
	PRIMARY KEY (group_id)
);
-- Create AccountPermission Table
CREATE TABLE AccountPermission (
    username CHAR(50)  NOT NULL,
    group_id CHAR(10)  NOT NULL,
    PRIMARY KEY (username, group_id),
    FOREIGN KEY (username) REFERENCES Account(username),
    FOREIGN KEY (group_id) REFERENCES PermissionGroup(group_id)
);