USE employee_tracker;

insert into departments( id, dept_name)
values  (1, 'Sales'),
        (2, 'Engineering'),
        (3, 'Finance'),
        (4, 'Legal');

insert into roles( id, title, salary, department_id)
values  (1, 'Sales Lead', 100000, 1),
        (2, 'Salesperson', 80000, 1),
        (3, 'Lead Engineer', 150000, 2),
        (4, 'Software Engineer', 120000, 2),
        (5, 'Account Manager', 160000, 3), 
        (6, 'Accountant', 125000, 3),
        (7, 'Legal Team Lead', 250000, 4),
        (8, 'Lawyer', 190000, 4);

insert into employees( id, first_name, last_name, role_id, manager_id)
values (1, 'John', 'Doe', 1, null),
       (2, 'Mike', 'Chan', 2, 1),
       (3, 'Ashley', 'Rodriguez', 3 , null),
       (4, 'Kevin', 'Tupik', 4, 3),
       (5, 'Kunal', 'Singh', 5, null),
       (6, 'Malia', 'Brown', 6, 5),
       (7, 'Sarah', 'Lourd', 7, null),
       (8, 'Tom', 'Allen', 8, 7);

