SELECT *
FROM roles
JOIN departments ON roles.department_id = departments.id;

SELECT *
FROM employee
JOIN roles ON employee.role_id = roles.id;

