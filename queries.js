import mysql from 'mysql2';
import inquirer from 'inquirer';
import Table from 'cli-table3'; // https://www.npmjs.com/package/cli-table3
import dotenv from 'dotenv';
dotenv.config();

const databaseQueries = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployeeNames,
    viewEmployeeSalary,
    viewEmployeeDepartment,
    viewEmployeeRole,
    viewEmployeeInfo,
    viewEmployeeManager

  };

async function viewAllDepartments(db) {
  try {
    const [results] = await db.query("SELECT id, dept_name as Department FROM departments ORDER BY id");
    const table = new Table({
      head: ["ID", "Department"],
      colWidths: [5, 20],
    });
    results.forEach(({ id, Department }) => {
      table.push([id, Department]);
    });
    console.log(table.toString());
  } catch (err) {
    console.error("Error querying departments:", err);
  }
}

// View all Roles
async function viewAllRoles(db) {
    try {
      const [results] = await db.query(
        "SELECT ro.id, ro.title, ro.salary, de.dept_name as Department " +
        "FROM roles ro " +
        "JOIN departments de ON ro.department_id = de.id " +
        "ORDER BY ro.id"
      );
  
      // Display roles in a table
      const table = new Table({
        head: ["ID", "Title", "Salary", "Department"],
        colWidths: [5, 20, 15, 20],
      });
  
      results.forEach(({ id, title, salary, Department }) => {
        table.push([id, title, salary, Department]);
      });
  
      console.log(table.toString());
    } catch (err) {
      console.error("Error querying roles:", err);
    }
  }

// View All Employees
async function viewAllEmployeeNames(db) {
    try {
      const [results] = await db.query(
        "SELECT em.id, em.first_name, em.last_name " +
        "FROM employees em " +
        "ORDER BY em.id"
      );
  
      // Adjusted table to display only ID, First Name, and Last Name
      const table = new Table({
        head: ["ID", "First Name", "Last Name"],
        colWidths: [5, 15, 15], // Adjust column widths as needed
      });
  
      results.forEach(({ id, first_name, last_name }) => {
        table.push([id, first_name, last_name]);
      });
  
      console.log(table.toString());
    } catch (err) {
      console.error("Error querying the database:", err);
    }
  }

// View Employees by Manager
async function viewEmployeeManager(db) {
    try {
      const [managers] = await db.query(
        'SELECT DISTINCT manager.id, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name ' +
        "FROM employees manager " +
        "JOIN employees em ON manager.id = em.manager_id"
      );
  
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "manager_id",
          message: "Select the manager:",
          choices: managers.map(manager => ({
            name: manager.manager_name,
            value: manager.id,
          })),
        },
      ]);
  
      const [results] = await db.query(
        "SELECT em.id, em.first_name, em.last_name, ro.title, de.dept_name, ro.salary, " +
        'IFNULL(CONCAT(manager.first_name, " ", manager.last_name), "N/A") AS manager ' +
        "FROM employees em " +
        "JOIN roles ro ON em.role_id = ro.id " +
        "JOIN departments de ON ro.department_id = de.id " +
        "LEFT JOIN employees manager ON em.manager_id = manager.id " +
        "WHERE em.manager_id = ? " +
        "ORDER BY em.id",
        [answers.manager_id]
      );
  
      // Display employees under the selected manager in a table
      const table = new Table({
        head: ["ID", "First Name", "Last Name", "Title", "Department", "Salary", "Manager"],
        colWidths: [5, 15, 15, 20, 15, 10, 20],
      });
  
      results.forEach(({ id, first_name, last_name, title, dept_name, salary, manager }) => {
        table.push([id, first_name, last_name, title, dept_name, salary, manager]);
      });
  
      console.log(table.toString());
    } catch (err) {
      console.error("Error processing your request:", err);
    }
  }

// View Employees by Department
async function viewEmployeeDepartment(db) {
    try {
      const [departments] = await db.query("SELECT id, dept_name FROM departments");
  
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "department_id",
          message: "Select the department:",
          choices: departments.map(department => ({
            name: department.dept_name,
            value: department.id,
          })),
        },
      ]);
  
      const [results] = await db.query(
        "SELECT em.id, em.first_name, em.last_name, ro.title, de.dept_name, ro.salary, " +
        'IFNULL(CONCAT(manager.first_name, " ", manager.last_name), "N/A") AS manager ' +
        "FROM employees em " +
        "JOIN roles ro ON em.role_id = ro.id " +
        "JOIN departments de ON ro.department_id = de.id " +
        "LEFT JOIN employees manager ON em.manager_id = manager.id " +
        "WHERE ro.department_id = ? " +
        "ORDER BY em.id",
        [answers.department_id]
      );
  
      // Display employees in the selected department in a table
      const table = new Table({
        head: ["ID", "First Name", "Last Name", "Title", "Department", "Salary", "Manager"],
        colWidths: [5, 15, 15, 20, 15, 10, 20],
      });
  
      results.forEach(({ id, first_name, last_name, title, dept_name, salary, manager }) => {
        table.push([id, first_name, last_name, title, dept_name, salary, manager]);
      });
  
      console.log(table.toString());
    } catch (err) {
      console.error("Error processing your request:", err);
    }
  }

// View Employees by Role
async function viewEmployeeRole(db) {
    try {
      const [roles] = await db.query("SELECT id, title FROM roles");
  
      const answer = await inquirer.prompt([
        {
          type: "list",
          name: "role_id",
          message: "Select the role:",
          choices: roles.map(role => ({
            name: role.title,
            value: role.id,
          })),
        },
      ]);
  
      const [results] = await db.query(
        "SELECT em.id, em.first_name, em.last_name, ro.title, " +
        'IFNULL(CONCAT(manager.first_name, " ", manager.last_name), "N/A") AS manager, ro.salary ' +
        "FROM employees em " +
        "JOIN roles ro ON em.role_id = ro.id " +
        "LEFT JOIN employees manager ON em.manager_id = manager.id " +
        "WHERE em.role_id = ? " +
        "ORDER BY em.id",
        [answer.role_id]
      );
  
      // Display employees in the selected role in a table
      const table = new Table({
        head: ["ID", "First Name", "Last Name", "Title", "Salary", "Manager"],
        colWidths: [5, 15, 15, 20, 10, 20],
      });
  
      results.forEach(({ id, first_name, last_name, title, salary, manager }) => {
        table.push([id, first_name, last_name, title, salary, manager]);
      });
  
      console.log(table.toString());
    } catch (err) {
      console.error("Error processing your request:", err);
    }
  }

// View All Employees
async function viewEmployeeSalary(db) {
    try {
      const [results] = await db.query(
        "SELECT em.first_name, em.last_name, ro.salary " +
        "FROM employees em " +
        "JOIN roles ro ON em.role_id = ro.id " +
        "ORDER BY em.id"
      );
  
      const table = new Table({
        head: ["First Name", "Last Name", "Salary"],
        colWidths: [15, 15, 10],
      });
  
      results.forEach(({ first_name, last_name, salary }) => {
        table.push([first_name, last_name, salary]);
      });
  
      console.log(table.toString());
    } catch (err) {
      console.error("Error querying the database:", err);
    }
  }

  async function viewEmployeeInfo(db) {
    try {
      const [results] = await db.query(
        "SELECT em.id, em.first_name, em.last_name, ro.title, de.dept_name, ro.salary, " +
        'IFNULL(CONCAT(manager.first_name, " ", manager.last_name), "N/A") AS manager ' +
        "FROM employees em " +
        "JOIN roles ro ON em.role_id = ro.id " +
        "JOIN departments de ON ro.department_id = de.id " +
        "LEFT JOIN employees manager ON em.manager_id = manager.id " +
        "ORDER BY em.id"
      );
  
      const table = new Table({
        head: ["ID", "First Name", "Last Name", "Title", "Department", "Salary", "Manager"],
        colWidths: [5, 15, 15, 20, 15, 10, 20],
      });
  
      results.forEach(({ id, first_name, last_name, title, dept_name, salary, manager }) => {
        table.push([id, first_name, last_name, title, dept_name, salary, manager]);
      });
  
      console.log(table.toString());
    } catch (err) {
      console.error("Error querying the database:", err);
    }
  }

export default databaseQueries;
