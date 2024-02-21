const mysql = require('mysql2');
const inquirer = require('inquirer'); // In order to install inquirer, please use npm i inquirer@8.2.4.
const Table = require('cli-table3'); // https://www.npmjs.com/package/cli-table3
require('dotenv').config();

function viewAllDepartments(db) {
  // Query to fetch all departments
  db.query(
    "SELECT id, dept_name as Department " + "FROM departments " + "ORDER BY id",
    function (err, results) {
      if (err) {
        console.error("Error querying departments:", err);
        return;
      }

      // Display departments in a table
      const table = new Table({
        head: ["ID", "Department"],
        colWidths: [5, 20],
      });

      results.forEach(({ id, Department }) => {
        table.push([id, Department]);
      });

      console.log(table.toString());

    }
  );
}

// View all Roles
function viewAllRoles(db) {
  db.query(
    "SELECT ro.id, ro.title, ro.salary, de.dept_name as Department " +
      "FROM roles ro " +
      "JOIN departments de ON ro.department_id = de.id " +
      "ORDER BY ro.id",
    function (err, results) {
      if (err) {
        console.error("Error querying roles:", err);
        return;
      }

      // Display roles in a table
      const table = new Table({
        head: ["ID", "Title", "Salary", "Department"],
        colWidths: [5, 20, 15, 20],
      });

      results.forEach(({ id, title, salary, Department }) => {
        table.push([id, title, salary, Department]);
      });

      console.log(table.toString());
    }
  );
}

// View All Employees
function viewAllEmployeeNames(db) {
  // Adjusted query to fetch only id, last_name, and first_name
  db.query(
    "SELECT em.id, em.first_name, em.last_name " +
      "FROM employees em " +
      "ORDER BY em.id",
    function (err, results) {
      if (err) {
        console.error("Error querying the database:", err);
        return;
      }

      // Adjusted table to display only ID, First Name, and Last Name
      const table = new Table({
        head: ["ID", "First Name", "Last Name"],
        colWidths: [5, 15, 15], // Adjust column widths as needed
      });

      results.forEach(({ id, first_name, last_name }) => {
        table.push([id, first_name, last_name]);
      });

      console.log(table.toString());
      init();
    }
  );
}

// View Employees by Manager
function viewEmployeeManager(db) {
  db.query(
    'SELECT DISTINCT manager.id, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name ' +
      "FROM employees manager " +
      "JOIN employees em ON manager.id = em.manager_id",
    function (err, managers) {
      if (err) {
        console.error("Error fetching managers:", err);
        return;
      }

      // Prompt user to select a manager
      inquirer
        .prompt([
          {
            type: "list",
            name: "manager_id",
            message: "Select the manager:",
            choices: managers.map((manager) => ({
              name: manager.manager_name,
              value: manager.id,
            })),
          },
        ])
        .then((answer) => {
          db.query(
            "SELECT em.id, em.first_name, em.last_name, ro.title, de.dept_name, ro.salary, " +
              'IFNULL(CONCAT(manager.first_name, " ", manager.last_name), "N/A") AS manager ' +
              "FROM employees em " +
              "JOIN roles ro ON em.role_id = ro.id " +
              "JOIN departments de ON ro.department_id = de.id " +
              "LEFT JOIN employees manager ON em.manager_id = manager.id " +
              "WHERE em.manager_id = ? " +
              "ORDER BY em.id",
            [answer.manager_id],
            function (err, results) {
              if (err) {
                console.error("Error querying the database:", err);
                return;
              }

              // Display employees under the selected manager in a table
              const table = new Table({
                head: [
                  "ID",
                  "First Name",
                  "Last Name",
                  "Title",
                  "Department",
                  "Salary",
                  "Manager",
                ],
                colWidths: [5, 15, 15, 20, 15, 10, 20],
              });

              results.forEach(
                ({
                  id,
                  first_name,
                  last_name,
                  title,
                  dept_name,
                  salary,
                  manager,
                }) => {
                  table.push([
                    id,
                    first_name,
                    last_name,
                    title,
                    dept_name,
                    salary,
                    manager,
                  ]);
                }
              );

              console.log(table.toString());
            }
          );
        });
    }
  );
}

// View Employees by Department
function viewEmployeeDepartment(db) {
  // Fetch departments from the database
  db.query(
    "SELECT id, dept_name FROM departments",
    function (err, departments) {
      if (err) {
        console.error("Error fetching departments:", err);
        return;
      }

      // Prompt user to select a department
      inquirer
        .prompt([
          {
            type: "list",
            name: "department_id",
            message: "Select the department:",
            choices: departments.map((department) => ({
              name: department.dept_name,
              value: department.id,
            })),
          },
        ])
        .then((answer) => {
          // Query to fetch employees in the selected department
          db.query(
            "SELECT em.id, em.first_name, em.last_name, ro.title, de.dept_name, ro.salary, " +
              'IFNULL(CONCAT(manager.first_name, " ", manager.last_name), "N/A") AS manager ' +
              "FROM employees em " +
              "JOIN roles ro ON em.role_id = ro.id " +
              "JOIN departments de ON ro.department_id = de.id " +
              "LEFT JOIN employees manager ON em.manager_id = manager.id " +
              "WHERE ro.department_id = ? " +
              "ORDER BY em.id",
            [answer.department_id],
            function (err, results) {
              if (err) {
                console.error("Error querying the database:", err);
                return;
              }

              // Display employees in the selected department in a table
              const table = new Table({
                head: [
                  "ID",
                  "First Name",
                  "Last Name",
                  "Title",
                  "Department",
                  "Salary",
                  "Manager",
                ],
                colWidths: [5, 15, 15, 20, 15, 10, 20],
              });

              results.forEach(
                ({
                  id,
                  first_name,
                  last_name,
                  title,
                  dept_name,
                  salary,
                  manager,
                }) => {
                  table.push([
                    id,
                    first_name,
                    last_name,
                    title,
                    dept_name,
                    salary,
                    manager,
                  ]);
                }
              );

              console.log(table.toString());
            }
          );
        });
    }
  );
}

// View Employees by Role
function viewEmployeeRole(db) {
  // Fetch roles from the database
  db.query("SELECT id, title FROM roles", function (err, roles) {
    if (err) {
      console.error("Error fetching roles:", err);
      return;
    }

    // Prompt user to select a role
    inquirer
      .prompt([
        {
          type: "list",
          name: "role_id",
          message: "Select the role:",
          choices: roles.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
      ])
      .then((answer) => {
        // Query to fetch employees in the selected role
        db.query(
          "SELECT em.id, em.first_name, em.last_name, ro.title, " +
            'IFNULL(CONCAT(manager.first_name, " ", manager.last_name), "N/A") AS manager, ro.salary ' +
            "FROM employees em " +
            "JOIN roles ro ON em.role_id = ro.id " +
            "LEFT JOIN employees manager ON em.manager_id = manager.id " +
            "WHERE em.role_id = ? " +
            "ORDER BY em.id",
          [answer.role_id],
          function (err, results) {
            if (err) {
              console.error("Error querying the database:", err);
              return;
            }

            // Display employees in the selected role in a table
            const table = new Table({
              head: [
                "ID",
                "First Name",
                "Last Name",
                "Title",
                "Salary",
                "Manager",
              ],
              colWidths: [5, 15, 15, 20, 10, 20],
            });

            results.forEach(
              ({ id, first_name, last_name, title, salary, manager }) => {
                table.push([id, first_name, last_name, title, salary, manager]);
              }
            );

            console.log(table.toString());
          }
        );
      });
  });
}

// View All Employees
function viewAllEmployeeSalary(db) {
  db.query(
    "SELECT em.first_name, em.last_name, ro.salary " +
      "FROM employees em " +
      "JOIN roles ro ON em.role_id = ro.id " +
      "ORDER BY em.id",
    function (err, results) {
      if (err) {
        console.error("Error querying the database:", err);
        return;
      }

      // Adjusted table to display only First Name, Last Name, and Salary
      const table = new Table({
        head: ["First Name", "Last Name", "Salary"],
        colWidths: [15, 15, 10],
      });

      results.forEach(({ first_name, last_name, salary }) => {
        table.push([first_name, last_name, salary]);
      });

      console.log(table.toString());
    }
  );
}

function viewEmployeeInfo(db) {
  // Query to fetch all employee details
  db.query(
    "SELECT em.id, em.first_name, em.last_name, ro.title, de.dept_name, ro.salary, " +
      'IFNULL(CONCAT(manager.first_name, " ", manager.last_name), "N/A") AS manager ' +
      "FROM employees em " +
      "JOIN roles ro ON em.role_id = ro.id " +
      "JOIN departments de ON ro.department_id = de.id " +
      "LEFT JOIN employees manager ON em.manager_id = manager.id " +
      "ORDER BY em.id",
    function (err, results) {
      if (err) {
        console.error("Error querying the database:", err);
        return;
      }

      // Display employee details in a table
      const table = new Table({
        head: [
          "ID",
          "First Name",
          "Last Name",
          "Title",
          "Department",
          "Salary",
          "Manager",
        ],
        colWidths: [5, 15, 15, 20, 15, 10, 20],
      });

      results.forEach(
        ({ id, first_name, last_name, title, dept_name, salary, manager }) => {
          table.push([
            id,
            first_name,
            last_name,
            title,
            dept_name,
            salary,
            manager,
          ]);
        }
      );

      console.log(table.toString());
    }
  );
}
