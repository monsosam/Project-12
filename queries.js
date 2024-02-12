class DatabaseQueries {
    constructor(connection) {
      this.connection = connection;
    }
  
    async viewAllDepartments() {
      try {
        const [rows] = await this.connection.query('SELECT * FROM department');
        console.table(rows);
      } catch (error) {
        console.error('Failed to retrieve departments:', error);
      }
    }
  
    async addDepartment(departmentName) {
      try {
        const [result] = await this.connection.query('INSERT INTO department (name) VALUES (?)', [departmentName]);
        console.log(`Added department: ${departmentName}`);
      } catch (error) {
        console.error('Failed to add department:', error);
      }
    }
  
    async viewAllRoles() {
        try {
          const query = `
            SELECT role.id, role.title, department.name AS department, role.salary
            FROM role
            INNER JOIN department ON role.department_id = department.id
            ORDER BY role.id ASC`;
          const [roles] = await this.connection.query(query);
          console.table(roles);
        } catch (error) {
          console.error('Failed to retrieve roles:', error);
        }
    }

    async addRole(title, salary, departmentId) {
        try {
          const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
          const [result] = await this.connection.query(query, [title, salary, departmentId]);
          console.log(`Added role: ${title}`);
        } catch (error) {
          console.error('Failed to add role:', error);
        }
    }

    async viewAllEmployees() {
        try {
          const query = `
            SELECT e.id, e.first_name, e.last_name, 
                   role.title, department.name AS department, 
                   role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role ON e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            ORDER BY e.id ASC`;
          const [employees] = await this.connection.query(query);
          console.table(employees);
        } catch (error) {
          console.error('Failed to retrieve employees:', error);
        }
    }

    async addEmployee(firstName, lastName, roleId, managerId) {
        try {
          const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
          const [result] = await this.connection.query(query, [firstName, lastName, roleId, managerId]);
          console.log(`Added employee: ${firstName} ${lastName}`);
        } catch (error) {
          console.error('Failed to add employee:', error);
        }
    }

    async updateEmployeeRole(employeeId, newRoleId) {
        try {
          const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          const [result] = await this.connection.query(query, [newRoleId, employeeId]);
          console.log(`Updated employee's role. Employee ID: ${employeeId}, New Role ID: ${newRoleId}`);
        } catch (error) {
          console.error('Failed to update employee role:', error);
        }
    }
}

async function promptAddRole() {
    // Optional: Fetch departments to let the user choose
    const [departments] = await dbQueries.viewAllDepartmentsForChoices();
    const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));
  
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the new role?',
        validate: input => input ? true : 'Role title cannot be empty.'
      },
      {
        type: 'number',
        name: 'salary',
        message: 'What is the salary for this role?',
        validate: input => input ? true : 'Salary must be provided.'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department does this role belong to?',
        choices: departmentChoices
      }
    ]).then(({ title, salary, departmentId }) => {
      dbQueries.addRole(title, salary, departmentId)
        .then(() => showMainMenu())
        .catch(error => {
          console.error('Error adding role:', error);
          showMainMenu();
        });
    });
}

function promptAddDepartment() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the new department?',
        validate: input => input ? true : 'Department name cannot be empty.'
      }
    ]).then(({ departmentName }) => {
      dbQueries.addDepartment(departmentName)
        .then(() => showMainMenu())
        .catch(error => {
          console.error('Error adding department:', error);
          showMainMenu();
        });
    });
}

async function promptAddEmployee() {
    // Fetch roles and managers for the user to choose from
    const [roles] = await dbQueries.viewAllRolesForChoices();
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));
    const [managers] = await dbQueries.viewAllManagersForChoices();
    const managerChoices = managers.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }));
    managerChoices.unshift({ name: 'No Manager', value: null }); // Option for no manager
  
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'What is the employee\'s first name?',
        validate: input => input ? true : 'First name cannot be empty.'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is the employee\'s last name?',
        validate: input => input ? true : 'Last name cannot be empty.'
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'What is the employee\'s role?',
        choices: roleChoices
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Who is the employee\'s manager?',
        choices: managerChoices
      }
    ]).then(({ firstName, lastName, roleId, managerId }) => {
      dbQueries.addEmployee(firstName, lastName, roleId, managerId)
        .then(() => showMainMenu())
        .catch(error => {
          console.error('Error adding employee:', error);
          showMainMenu();
        });
    });
}

module.exports = DatabaseQueries;
  