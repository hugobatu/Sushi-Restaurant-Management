GO
USE SushiXRestaurant


/*insert data into menu item*/
PRINT 'Loading MenuCategory';
BULK INSERT MenuItem FROM 'D:\Downloads\DATH\Sushi-Restaurant-Management\src\backend\data\menu_item.csv'
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
/*insert data into menu category*/
PRINT 'Loading MenuCategory';
BULK INSERT MenuCategory FROM 'D:\Downloads\DATH\Sushi-Restaurant-Management\src\backend\data\category_table.csv'
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


INSERT INTO MenuItemCategory(item_id, category_id)
VALUES
('A1', 'A'),
('A10', 'A'),
('A11', 'A'),
('A12', 'A'),
('A2', 'A'),
('A3', 'A'),
('A4', 'A'),
('A5', 'A'),
('A6', 'A'),
('A7', 'A'),
('A8', 'A'),
('A9', 'A'),
('B1', 'B'),
('B2', 'B'),
('B3', 'B'),
('B4', 'B'),
('B5', 'B'),
('BE1', 'BE'),
('BE2', 'BE'),
('BE3', 'BE'),
('C1', 'C'),
('C2', 'C'),
('D1', 'D'),
('D2', 'D'),
('D3', 'D'),
('D4', 'D'),
('D5', 'D'),
('F1', 'F'),
('F2', 'F'),
('F3', 'F'),
('FJ2', 'FJ'),
('FJ3', 'FJ'),
('FJ4', 'FJ'),
('FJ1', 'FJ'),
('FJ5', 'FJ'),
('FJ6', 'FJ'),
('FJ7', 'FJ'),
('FJ8', 'FJ'),
('G1', 'G'),
('G2', 'G'),
('G3', 'G'),
('G4', 'G'),
('HO1', 'HO'),
('HO2', 'HO'),
('HO3', 'HO'),
('HP1', 'HP'),
('HP2', 'HP'),
('HP3', 'HP'),
('HP4', 'HP'),
('IC1', 'IC'),
('IC2', 'IC'),
('IC3', 'IC'),
('IC4', 'IC'),
('IC5', 'IC'),
('M1', 'M'),
('M10', 'M'),
('M11', 'M'),
('M12', 'M'),
('M13', 'M'),
('M2', 'M'),
('M3', 'M'),
('M4', 'M'),
('M5', 'M'),
('M6', 'M'),
('M7', 'M'),
('M8', 'M'),
('M9', 'M'),
('MO2', 'MO'),
('MO3', 'MO'),
('MO1', 'MO'),
('N1', 'N'),
('N10', 'N'),
('N11', 'N'),
('N12', 'N'),
('N14', 'N'),
('N15', 'N'),
('N16', 'N'),
('N2', 'N'),
('N3', 'N'),
('N4', 'N'),
('N5', 'N'),
('N6', 'N'),
('N7', 'N'),
('N8', 'N'),
('N9', 'N'),
('ND1', 'ND'),
('ND10', 'ND'),
('ND11', 'ND'),
('ND2', 'ND'),
('ND3', 'ND'),
('ND4', 'ND'),
('ND5', 'ND'),
('ND6', 'ND'),
('ND7', 'ND'),
('ND8', 'ND'),
('ND9', 'ND'),
('SA1', 'SA'),
('SA10', 'SA'),
('SA11', 'SA'),
('SA12', 'SA'),
('SA14', 'SA'),
('SA2', 'SA'),
('SA3', 'SA'),
('SA4', 'SA'),
('SA5', 'SA'),
('SA6', 'SA'),
('SA7', 'SA'),
('SA8', 'SA'),
('SA9', 'SA'),
('SD1', 'SD'),
('SD2', 'SD'),
('SD3', 'SD'),
('SD4', 'SD'),
('SD5', 'SD'),
('SE1', 'SE'),
('SE10', 'SE'),
('SE11', 'SE'),
('SE12', 'SE'),
('SE13', 'SE'),
('SE14', 'SE'),
('SE15', 'SE'),
('SE3', 'SE'),
('SE4', 'SE'),
('SE5', 'SE'),
('SE6', 'SE'),
('SE7', 'SE'),
('SE8', 'SE'),
('SE9', 'SE'),
('SL1', 'SL'),
('SL2', 'SL'),
('SL3', 'SL'),
('SL4', 'SL'),
('SL5', 'SL'),
('SL7', 'SL'),
('SO1', 'SO'),
('SO2', 'SO'),
('SO3', 'SO'),
('ST1', 'ST'),
('ST10', 'ST'),
('ST11', 'ST'),
('ST12', 'ST'),
('ST13', 'ST'),
('ST2', 'ST'),
('ST3', 'ST'),
('ST4', 'ST'),
('ST5', 'ST'),
('ST6', 'ST'),
('ST7', 'ST'),
('ST8', 'ST'),
('ST9', 'ST'),
('T1', 'T'),
('T2', 'T'),
('T3', 'T'),
('TE1', 'TE'),
('TE2', 'TE'),
('TE3', 'TE'),
('TE4', 'TE'),
('TE6', 'TE'),
('TE7', 'TE'),
('TE8', 'TE'),
('TE5', 'TE'),
('TP1', 'TP'),
('TP2', 'TP'),
('TP3', 'TP'),
('TP4', 'TP'),
('WI1', 'WI'),
('WI2', 'WI'),
('WI3', 'WI'),
('WI4', 'WI'),
('Y1', 'Y'),
('Y2', 'Y'),
('Y3', 'Y'),
('Y4', 'Y'),
('Y5', 'Y'),
('Y6', 'Y')
