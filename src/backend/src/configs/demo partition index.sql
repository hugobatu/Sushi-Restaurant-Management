GO
USE SushiXRestaurant

EXEC sp_get_staff_info 'AMANDA MURPHY', 1, 10


select * from [Order]

select * from Bill

select * 
from Staff s
join Department d
on s.department_id = d.department_id
where d.department_name = 'manager'

select * from CustomerRating