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

-- account
CREATE TABLE Account (
    username CHAR(50) NOT NULL,
    [password] NVARCHAR(255) NOT NULL,
    account_type NVARCHAR(20) NOT NULL CHECK (account_type IN ('admin', 'user', 'guest')),
    account_status NVARCHAR(20) NOT NULL CHECK (account_status IN ('active', 'inactive')),
    day_created DATETIME2 NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (username)
);

-- Region
GO
CREATE TABLE Region (
	region_id CHAR(10) NOT NULL,
	region_name NVARCHAR(50) NOT NULL,
	PRIMARY KEY (region_id)
);
-- Branch
GO
CREATE TABLE Branch (
	branch_id CHAR(10) NOT NULL,
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
CREATE TABLE [Table] (
	table_id CHAR(10) NOT NULL,
	branch_id CHAR(10) NOT NULL,
	capacity INT,
	is_available BIT DEFAULT 1,
	PRIMARY KEY (table_id),
	FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);
-- Department
GO
CREATE TABLE Department (
	department_id CHAR(10) NOT NULL,
	department_name NVARCHAR(50) NOT NULL,
	base_salary FLOAT NOT NULL,
	PRIMARY KEY (department_id)
);
-- Staff
GO
CREATE TABLE Staff (
	staff_id CHAR(10) NOT NULL,
	branch_id CHAR(10) NOT NULL,
	department_id CHAR(10) NOT NULL,
	staff_name NVARCHAR(50) NOT NULL,
	birth_date DATE NOT NULL,
	gender NVARCHAR(10) NOT NULL CHECK (gender IN (N'Male', N'Female')),
	salary FLOAT NOT NULL,
	join_date DATE NOT NULL,
	resign_date DATE NULL,
    staff_status NVARCHAR(20) CHECK (staff_status IN (N'active', N'resigned')),
	username CHAR(50),
	PRIMARY KEY (staff_id),
	FOREIGN KEY (branch_id) REFERENCES Branch(branch_id),
	FOREIGN KEY (department_id) REFERENCES Department(department_id),
	FOREIGN KEY (username) REFERENCES Account(username)
);
-- Work history
GO
CREATE TABLE WorkHistory(
	staff_id CHAR(10) NOT NULL,
	department_id CHAR(10) NOT NULL,
	starting_date DATE NOT NULL,
	ending_date DATE,
	PRIMARY KEY (staff_id, department_id),
	FOREIGN KEY (staff_id) REFERENCES Staff(staff_id),
	FOREIGN KEY (department_id) REFERENCES Department(department_id)
);
-- Menu item
GO
CREATE TABLE MenuItem (
    item_id CHAR(10) NOT NULL,
    item_name NVARCHAR(50) NOT NULL,
    menu_item_description NVARCHAR(255),
    base_price FLOAT NOT NULL,
    menu_item_status NVARCHAR(20) CHECK (menu_item_status IN (N'available', N'unavailable')),
	PRIMARY KEY (item_id)
);
-- Menu category
GO
CREATE TABLE MenuCategory (
    category_id CHAR(10) NOT NULL,
    category_name NVARCHAR(50) NOT NULL,
    menu_category_description NVARCHAR(255),
	PRIMARY KEY (category_id)
);
-- Menu item category (using for linking between menucategory and menu items)
GO
CREATE TABLE MenuItemCategory (
    item_id CHAR(10) NOT NULL,
    category_id CHAR(10) NOT NULL,
    PRIMARY KEY (item_id, category_id),
    FOREIGN KEY (item_id) REFERENCES MenuItem(item_id),
    FOREIGN KEY (category_id) REFERENCES MenuCategory(category_id)
);
-- Branch menu item link menu item to branch with availability
GO
CREATE TABLE BranchMenuItem (
    branch_id CHAR(10) NOT NULL,
    item_id CHAR(10) NOT NULL,
    is_available BIT DEFAULT 1,
    PRIMARY KEY (branch_id, item_id),
    FOREIGN KEY (branch_id) REFERENCES Branch(branch_id),
    FOREIGN KEY (item_id) REFERENCES MenuItem(item_id)
);
-- Combo
GO
CREATE TABLE Combo (
    combo_id CHAR(10) NOT NULL,
    combo_name NVARCHAR(50),
    combo_description NVARCHAR(255),
	PRIMARY KEY (combo_id)
);
-- Customer
GO
CREATE TABLE Customer (
	customer_id CHAR(10) NOT NULL,
	customer_name NVARCHAR(50) NOT NULL,
	email CHAR(50) NOT NULL UNIQUE,
	phone_number CHAR(10) NOT NULL UNIQUE,
	gender NVARCHAR(10) NOT NULL CHECK (gender IN (N'Male', N'Female')),
	birth_date DATE NOT NULL,
	id_number CHAR(12) NOT NULL,
	username CHAR(50) NULL,
	PRIMARY KEY (customer_id),
	FOREIGN KEY (username) REFERENCES Account(username)
);
-- Rating from customer
GO
CREATE TABLE CustomerRating (
    rating_id INT IDENTITY(1,1), --auto increment
	customer_id CHAR(10) NOT NULL,
	branch_id CHAR(10) NOT NULL,
	service_manner_rating TINYINT CHECK(service_manner_rating > 0 AND service_manner_rating <= 10),
	branch_rating TINYINT CHECK(branch_rating > 0 AND branch_rating <= 10),
	food_quality_rating TINYINT CHECK(food_quality_rating > 0 AND food_quality_rating <= 10),
	price_rating TINYINT CHECK(price_rating > 0 AND price_rating <= 10),
	surroundings_rating TINYINT CHECK(surroundings_rating > 0 AND surroundings_rating <= 10),
	personal_response NVARCHAR(255),
	PRIMARY KEY (rating_id),
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
	FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);
-- Order
GO
CREATE TABLE Ordering(
	order_id CHAR(10) NOT NULL,
	customer_id CHAR(10) NOT NULL,
	branch_id CHAR(10) NOT NULL,
	order_datetime DATETIME NOT NULL,
    order_status NVARCHAR(20) NOT NULL CHECK (order_status IN (N'Pending', N'Done')),
	PRIMARY KEY (order_id),
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
	FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);
-- Order details
GO
CREATE TABLE OrderDetails (
	order_id CHAR(10) NOT NULL,
	item_id CHAR(10) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
	unit_price FLOAT NOT NULL,
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
	FOREIGN KEY (table_id) REFERENCES [Table](table_id)
);
-- Delivery order
GO
CREATE TABLE DeliveryOrder (
	order_id CHAR(10) NOT NULL,
	delivery_address NVARCHAR(255) NOT NULL,
	delivery_fee FLOAT NOT NULL,
	PRIMARY KEY (order_id),
	FOREIGN KEY (order_id) REFERENCES Ordering(order_id)
);
-- Reservation order
GO
CREATE TABLE ReservationOrder (
	order_id CHAR(10) NOT NULL,
	reservation_datetime DATETIME NOT NULL,
    num_guests INT NOT NULL CHECK (num_guests > 0),
    reservation_order_status NVARCHAR(20) NOT NULL CHECK (reservation_order_status IN (N'Pending', N'Confirmed')),
	PRIMARY KEY (order_id),
	FOREIGN KEY (order_id) REFERENCES Ordering(order_id)
);
-- Bill
GO
CREATE TABLE Bill (
	bill_id CHAR(10) NOT NULL,
	order_id CHAR(10) NOT NULL,
	subtotal FLOAT NOT NULL	,
	discount_amount FLOAT DEFAULT 0, --default is not discounted
	tax_amount FLOAT DEFAULT 0.8, --vat dafault is 8%
	payment_method NVARCHAR(20) NOT NULL CHECK (payment_method IN (N'Cash', 'Internet Banking')),
	bill_date DATETIME NOT NULL,
    bill_status NVARCHAR(20) CHECK (bill_status IN (N'Pending', N'Paid')),
	PRIMARY KEY (bill_id),
	FOREIGN KEY (order_id) REFERENCES Ordering(order_id)
);
-- promotion program
GO
CREATE TABLE PromotionProgram (
	program_id CHAR(10) NOT NULL,
	promotion_program_name NVARCHAR(50) NOT NULL,
	program_description NVARCHAR(255) ,
	starting_date DATETIME,
	end_date DATETIME,
	promotion_program_status NVARCHAR(20),
	PRIMARY KEY (program_id)
);
-- Coupon giam gia
GO
CREATE TABLE Coupon (
	coupon_id CHAR(10) NOT NULL,
	program_id CHAR(10) NOT NULL,
	bill_id CHAR(10) NULL,
	coupon_code CHAR(10) NOT NULL UNIQUE,
    discount_rate FLOAT NOT NULL CHECK (discount_rate > 0 AND discount_rate <= 1),
	max_amount INT NOT NULL,
	valid_from DATETIME NOT NULL,
	valid_to DATETIME NOT NULL,
    coupon_status NVARCHAR(20) CHECK (coupon_status IN (N'Active', N'Expired', N'Used')),
	PRIMARY KEY (coupon_id),
	FOREIGN KEY (bill_id) REFERENCES Bill(bill_id),
	FOREIGN KEY (program_id) REFERENCES PromotionProgram(program_id)
);
-- membership level
GO
CREATE TABLE MembershipLevel (
	level_id CHAR(10) NOT NULL,
	level_name NVARCHAR(20) NOT NULL CHECK (level_name IN (N'Silver', N'Gold')),
	discount_percentage FLOAT NOT NULL,
	min_points_required INT NOT NULL,
	min_spending FLOAT NOT NULL,
	maintenance_spending FLOAT NOT NULL,
	PRIMARY KEY (level_id)
);
-- Membership
GO
CREATE TABLE Membership(
	card_id CHAR(10) NOT NULL,
	level_id CHAR(10) NOT NULL,
	customer_id CHAR(10) NOT NULL,
	bill_id CHAR(10)  NULL,
	issued_date DATE NOT NULL,
	valid_until DATE NOT NULL,
    points INT NOT NULL CHECK (points >= 0),
    membership_status NVARCHAR(20) CHECK (membership_status IN (N'Active', N'Expire')),
	PRIMARY KEY (card_id),
	FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
	FOREIGN KEY (level_id) REFERENCES MembershipLevel(level_id),
	FOREIGN KEY (bill_id) REFERENCES Bill(bill_id)
);
-- online connection
CREATE TABLE OnlineConnection (
    connection_id CHAR(10) NOT NULL,
    username CHAR(50) NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME DEFAULT NULL,
    PRIMARY KEY (connection_id),
    FOREIGN KEY (username) REFERENCES Account(username)
);