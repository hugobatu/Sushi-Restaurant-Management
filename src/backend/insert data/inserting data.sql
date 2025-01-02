GO
USE SushiXRestaurant

/*insert data into ACCOUNT*/
PRINT 'Loading ACCOUNT';
BULK INSERT Account FROM 'path\account.csv'
WITH (
    CHECK_CONSTRAINTS,
    DATAFILETYPE = 'char',
    FIELDTERMINATOR= ',',
    KEEPIDENTITY,
    TABLOCK,
    FIRSTROW = 2,
	ROWTERMINATOR = '0x0a',
    FORMAT = 'CSV'
);

/*insert data into STAFF*/
PRINT 'Loading STAFF';
BULK INSERT Staff FROM 'path\staff_data.csv'
WITH (
    DATAFILETYPE = 'char',
    FIELDTERMINATOR= ',',
    KEEPIDENTITY,
    TABLOCK,
    FIRSTROW = 2,
	ROWTERMINATOR = '0x0a',
    FORMAT = 'CSV'
);

/*insert data into CUSTOMER*/
PRINT 'Loading CUSTOMER';
BULK INSERT Customer FROM 'path\customers_data.csv'
WITH (
    DATAFILETYPE = 'char',
    FIELDTERMINATOR= ',',
    KEEPIDENTITY,
    TABLOCK,
    FIRSTROW = 2,
	ROWTERMINATOR = '0x0a',
    FORMAT = 'CSV'
);

/*insert data into WorkHistory*/
PRINT 'Loading WorkHistory';
BULK INSERT WorkHistory FROM 'path\work_history.csv'
WITH (
    DATAFILETYPE = 'char',
    FIELDTERMINATOR= ',',
    KEEPIDENTITY,
    TABLOCK,
    FIRSTROW = 2,
	ROWTERMINATOR = '0x0a',
    FORMAT = 'CSV'
);

/*insert data into Order*/
PRINT 'Loading Order';
BULK INSERT [Order] FROM 'path\order.csv'
WITH (
    DATAFILETYPE = 'char',
    FIELDTERMINATOR= ',',
    KEEPIDENTITY,
    TABLOCK,
    FIRSTROW = 2,
	ROWTERMINATOR = '0x0a',
    FORMAT = 'CSV'
);

/*insert data into OrderDetail*/
PRINT 'Loading OrderDetail';
BULK INSERT OrderDetails FROM 'path\order_detail.csv'
WITH (
    DATAFILETYPE = 'char',
    FIELDTERMINATOR= ',',
    KEEPIDENTITY,
    TABLOCK,
    FIRSTROW = 2,
	ROWTERMINATOR = '0x0a',
    FORMAT = 'CSV'
);

/*insert data into DirectServiceOrder*/
PRINT 'Loading DirectServiceOrder';
BULK INSERT DirectServiceOrder FROM 'path\direct_service_order.csv'
WITH (
    DATAFILETYPE = 'char',
    FIELDTERMINATOR= ',',
    KEEPIDENTITY,
    TABLOCK,
    FIRSTROW = 2,
	ROWTERMINATOR = '0x0a',
    FORMAT = 'CSV'
);

/*insert data into CustomerRating*/
PRINT 'Loading Bill';
BULK INSERT Bill FROM 'path\bill.csv'
WITH (
    DATAFILETYPE = 'char',
    FIELDTERMINATOR= ',',
    KEEPIDENTITY,
    TABLOCK,
    FIRSTROW = 2,
	ROWTERMINATOR = '0x0a',
    FORMAT = 'CSV'
);

/*insert data into CustomerRating*/
PRINT 'Loading CustomerRating';
BULK INSERT CustomerRating FROM 'path\customer_rating.csv'
WITH (
    DATAFILETYPE = 'widechar',
    FIELDTERMINATOR = ',',
    KEEPIDENTITY,
    TABLOCK,
    FIRSTROW = 2,
    ROWTERMINATOR = '\n',
    FORMAT = 'CSV',
    FIELDQUOTE = '"'
);

/*insert data into Membership*/
PRINT 'Loading Membership';
BULK INSERT Membership FROM 'path\membership.csv'
WITH (
    DATAFILETYPE = 'widechar',
    FIELDTERMINATOR = ',',
    KEEPIDENTITY,
    TABLOCK,
    FIRSTROW = 2,
    ROWTERMINATOR = '\n',
    FORMAT = 'CSV',
    FIELDQUOTE = '"'
);