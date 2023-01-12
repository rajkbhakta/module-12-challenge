const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "raj123",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

let tracker = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "prompt",
        message: "choose action",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then((answer) => {
      if (answer.prompt == "view all departments") {
        db.query("SELECT * FROM department", (err, result) => {
          if (err) throw err;
          console.log(result);
          tracker();
        });
      } else if (answer.prompt === "view all roles") {
        db.query("SELECT * FROM role", function (err, results) {
          console.log(results);
          tracker();
        });
      } else if (answer.prompt === "view all employees") {
        db.query("SELECT * FROM employee", function (err, results) {
          console.log(results);
          tracker();
        });
      } else if (answer.prompt === "add a department") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "department",
              message: "department name:",
            },
          ])
          .then((answer) => {
            db.query(
              "INSERT INTO department (name) VALUES (?)",
              [answer.department],
              function (err, results) {
                console.log(results);
                tracker();
              }
            );
          });
      } else if (answer.prompt === "add a role") {
        db.query("SELECT * FROM department", (err, result) => {
          if (err) throw err;
          console.log("done");
          inquirer
            .prompt([
              {
                type: "input",
                name: "role",
                message: "title of role:",
              },
              {
                type: "input",
                name: "salary",
                message: "salary amount:",
              },
              {
                type: "list",
                name: "department",
                message: "department:",
                choices: () => {
                  let departArray = [];
                  for (let i = 0; i < result.length; i++) {
                    departArray.push(result[i].name);
                  }
                  return departArray;
                },
              },
            ])
            .then((answers) => {
              let department;
              for (let i = 0; i < result.length; i++) {
                if (result[i].name === answers.department) {
                  department = result[i].id;
                }
              }
              db.query(
                "INSERT INTO role (title,salary,department_id) VALUES (?,?,?)",
                [answers.role, answers.salary, department.id],
                function (err, results) {
                  if (err) throw err;
                  console.log("done");
                  tracker();
                }
              );
            });
        });
      } else if (answer.prompt === "add an employee") {
        db.query("SELECT * FROM role", (err, result) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                type: "input",
                name: "firstname",
                message: "first-name:",
              },
              { type: "input", name: "lastname", message: "last-name:" },
              {
                type: "list",
                name: "role",
                message: "role:",
                choices: () => {
                  let roleArray = [];
                  for (let i = 0; i < result.length; i++) {
                    roleArray.push(result[i].title);
                  }
                  return roleArray;
                },
              },
            ])
            .then((answers) => {
              let role;
              for (let i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                  role = result[i].id;
                }
              }

              db.query(
                "INSERT INTO employee(first_name,last_name,role_id) VALUES (?,?,?)",
                [answers.firstname, answers.lastname, role.id],
                function (err, results) {
                  if (err) throw err;
                  console.log("done");
                  tracker();
                }
              );
            });
        });
      } else if (answer.prompt === "update an employee role") {
        db.query("SELECT * FROM role,employee", (err, result) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                message: "employee to update:",
                choices: () => {
                  let empArray = [];
                  for (let i = 0; i < result.length; i++) {
                    empArray.push(result[i].first_name);
                  }
                  return [...new Set(empArray)];
                },
              },
              {
                type: "list",
                name: "role",
                message: "role:",
                choices: () => {
                  let roleArray = [];
                  for (let i = 0; i < result.length; i++) {
                    roleArray.push(result[i].title);
                  }
                  return [...new Set(roleArray)];
                },
              },
            ])
            .then((answers) => {
              
              for (let i = 0; i < result.length; i++) {
                if (result[i].first_name === answers.employee) {
                 var name = result[i];
                }
              }
              for (let i = 0; i < result.length; i++) {
                if (result[i].title === answers.role) {
                 var role = result[i];
                }
              }

              db.query(
                "UPDATE employee SET ? WHERE ?", [{role_id:role},{last_name: name}],
                function (err, results) {
                  if (err) throw err;
                  console.log("done");
                  tracker();
                }
              );
            });
        });
      }
    });
};

// db.query('SELECT COUNT(id) AS total_count FROM favorite_books GROUP BY in_stock', function (err, results) {
//   console.log(results);
// });

// db.query('SELECT SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section', function (err, results) {
//   console.log(results);
// });
tracker();
