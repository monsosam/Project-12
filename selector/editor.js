import mysql from "mysql2";
import inquirer from "inquirer";
import Table from "cli-table3"; // https://www.npmjs.com/package/cli-table3
import dotenv from "dotenv";
dotenv.config();

const editorQueries = {
  addDepartment,
  addEmployee,
  addRole,
  updateEmployee,
  removeDepartment,
  removeEmployee,
  removeRole,
};


// Add Employee
async function addEmployee(db) {
    try {
      // Fetch roles and managers in parallel
      const [roles] = await db.query("SELECT id, title FROM roles");
      const [managers] = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM employees');
  
      // Prepare choices for inquirer prompts
      const roleChoices = roles.map(role => ({
        name: role.title,
        value: role.id,
      }));
  
      const managerChoices = [{ name: "None", value: null }, 
        ...managers.map(manager => ({
          name: manager.manager_name,
          value: manager.id,
        }))
      ];
  
      // Prompt user for employee details
      const employeeData = await inquirer.prompt([
        {
          type: "input",
          name: "first_name",
          message: "Enter the employee's first name:",
        },
        {
          type: "input",
          name: "last_name",
          message: "Enter the employee's last name:",
        },
        {
          type: "list",
          name: "role_id",
          message: "Select the employee's role:",
          choices: roleChoices,
        },
        {
          type: "list",
          name: "manager_id",
          message: "Select the employee's manager:",
          choices: managerChoices,
        },
      ]);
  
      // Insert new employee into the database
      const [result] = await db.query("INSERT INTO employees SET ?", {
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        role_id: employeeData.role_id,
        manager_id: employeeData.manager_id || null,
      });
  
      console.log(`Employee ${employeeData.first_name} ${employeeData.last_name} added successfully!`);
  
    } catch (err) {
      console.error("Error adding the employee:", err);
    }
  }

// Update Employee
async function updateEmployee(db) {
    try {
      // Fetch employees
      const [employees] = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employees');
      
      // Prompt user to select an employee
      const { employee_id, update_role } = await inquirer.prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Select the employee to update:",
          choices: employees.map(employee => ({
            name: employee.employee_name,
            value: employee.id,
          })),
        },
        {
          type: "confirm",
          name: "update_role",
          message: "Does this employee have a new role?",
          default: false,
        },
      ]);
  
      let role_id;
      if (update_role) {
        // Fetch roles
        const [roles] = await db.query("SELECT id, title FROM roles");
        const roleAnswer = await inquirer.prompt([
          {
            type: "list",
            name: "role_id",
            message: "Select the employee's new role:",
            choices: roles.map(role => ({
              name: role.title,
              value: role.id,
            })),
          },
        ]);
        role_id = roleAnswer.role_id;
      }
  
      // Check if the employee has a new manager
      const { update_manager } = await inquirer.prompt([
        {
          type: "confirm",
          name: "update_manager",
          message: "Does this employee have a new manager?",
          default: false,
        },
      ]);
  
      let manager_id = null; // Default to no manager
      if (update_manager) {
        // Fetch managers
        const [managers] = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM employees');
        const managerChoices = [{ name: "None", value: null }, ...managers.map(manager => ({
          name: manager.manager_name,
          value: manager.id,
        }))];
        
        const managerAnswer = await inquirer.prompt([
          {
            type: "list",
            name: "manager_id",
            message: "Select the employee's new manager:",
            choices: managerChoices,
          },
        ]);
        manager_id = managerAnswer.manager_id;
      }
  
      // Construct update data object based on user inputs
      const updateData = {};
      if (role_id) updateData.role_id = role_id;
      if (manager_id !== null) updateData.manager_id = manager_id;
  
      // Update the employee in the database
      await db.query("UPDATE employees SET ? WHERE id = ?", [updateData, employee_id]);
      console.log("Employee updated successfully!");
  
    } catch (err) {
      console.error("Error updating the employee:", err);
    }
  }

// Remove Employee
async function removeEmployee(db) {
    try {
      // Fetch employees dynamically from the database
      const [employees] = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employees');
      
      // Prompt user to select an employee to remove
      const { employee_id, confirm_remove } = await inquirer.prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Select the employee to remove:",
          choices: employees.map(employee => ({
            name: employee.employee_name,
            value: employee.id,
          })),
        },
        {
          type: "confirm",
          name: "confirm_remove",
          message: "Are you sure you wish to remove this employee from the database?",
          default: false,
        },
      ]);
  
      if (!confirm_remove) {
        console.log("Employee removal canceled.");
        return;
      }
  
      // Remove the selected employee from the database
      await db.query("DELETE FROM employees WHERE id = ?", [employee_id]);
      console.log("Employee removed successfully!");
  
    } catch (err) {
      console.error("Error processing your request:", err);
    }
  }

// Add Role
async function addRole(db) {
    try {
      // Fetch departments dynamically from the database
      const [departments] = await db.query("SELECT id, dept_name FROM departments");
  
      // Prompt user for role details and department selection
      const roleData = await inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of the new role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary for the new role:",
        },
        {
          type: "list",
          name: "department_id",
          message: "Select the department for the new role:",
          choices: departments.map(department => ({
            name: department.dept_name,
            value: department.id,
          })),
        },
      ]);
  
      // Add the new role to the database
      await db.query("INSERT INTO roles SET ?", roleData);
      console.log(`Role ${roleData.title} added successfully!`);
  
    } catch (err) {
      console.error("Error processing your request:", err);
    }
  }

// Remove Role
async function removeRole(db) {
    try {
      // Fetch roles dynamically from the database
      const [roles] = await db.query("SELECT id, title FROM roles");
  
      // Prompt user to select a role to remove
      const { role_id, confirm_remove } = await inquirer.prompt([
        {
          type: "list",
          name: "role_id",
          message: "Select the role to remove:",
          choices: roles.map(role => ({
            name: role.title,
            value: role.id,
          })),
        },
        {
          type: "confirm",
          name: "confirm_remove",
          message: "Are you sure you wish to remove this role from the database?",
          default: false,
        },
      ]);
  
      if (!confirm_remove) {
        console.log("Role removal canceled.");
        return;
      }
  
      // Remove the selected role from the database
      await db.query("DELETE FROM roles WHERE id = ?", [role_id]);
      console.log("Role removed successfully!");
  
    } catch (err) {
      console.error("Error removing the role:", err);
    }
  }

// Add Department
async function addDepartment(db) {
    try {
      // Prompt user for the new department's name
      const { dept_name } = await inquirer.prompt([
        {
          type: "input",
          name: "dept_name",
          message: "Enter the department's name:",
        },
      ]);
  
      // Insert the new department into the database
      await db.query("INSERT INTO departments (dept_name) VALUES (?)", [dept_name]);
      console.log(`Department ${dept_name} added successfully!`);
  
    } catch (err) {
      console.error("Error adding the department:", err);
    }
  }

// Remove Department
async function removeDepartment(db) {
    try {
      // Fetch departments dynamically from the database
      const [departments] = await db.query("SELECT id, dept_name FROM departments");
  
      // Prompt user to select a department to remove
      const { department_id, confirm_remove } = await inquirer.prompt([
        {
          type: "list",
          name: "department_id",
          message: "Select the department to remove:",
          choices: departments.map(department => ({
            name: department.dept_name,
            value: department.id,
          })),
        },
        {
          type: "confirm",
          name: "confirm_remove",
          message: "Are you sure you wish to remove this department from the database?",
          default: false,
        },
      ]);
  
      if (!confirm_remove) {
        console.log("Department removal canceled.");
        return;
      }
  
      // Remove the selected department from the database
      await db.query("DELETE FROM departments WHERE id = ?", [department_id]);
      console.log("Department removed successfully!");
  
    } catch (err) {
      console.error("Error removing the department:", err);
    }
  }

export default editorQueries;
