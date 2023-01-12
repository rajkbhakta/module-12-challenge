INSERT INTO department
  (name)
VALUES
  ('Computer Science'),
  ('Sales'),
  ('Accounting'),
  ('Law');


INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Software Engineer', 85000, 1),
  ('Salesperson', 75000, 2),
  ('Accountant', 125000, 3),
  ('Lawyer', 200000, 4);

INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, 1),
  ('Jane', 'Doe', 2, 2),
  ('alex', 'Smith', 3, 3),
  ('raj', 'Smith', 4, 4);
