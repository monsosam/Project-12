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
          const [employees] = await this.connection.query('SELECT * FROM employee');
          // Process and return employees data as needed
          return employees;
      } catch (error) {
          console.error('Failed to retrieve employees:', error);
          throw error; // Ensure errors are handled or logged
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

    async getDepartmentsForChoices() {
      try {
          const [departments] = await this.connection.query('SELECT id, name FROM department');
          return departments.map(department => ({
              name: department.name,
              value: department.id
          }));
      } catch (error) {
          console.error('Failed to retrieve departments for choices:', error);
          throw error; // Rethrow to allow calling code to handle it
      }
  }

  async getRolesForChoices() {
    try {
        const [roles] = await this.connection.query('SELECT id, title FROM role');
        return roles.map(role => ({
            name: role.title, // Displayed in the prompt
            value: role.id    // Used as the value when a role is selected
        }));
    } catch (error) {
        console.error('Failed to retrieve roles:', error);
        throw error;
    }
  }

  async getManagersForChoices() {
    try {
        // Example query: adjust based on your schema, e.g., you might want to filter employees who can be managers
        const [managers] = await this.connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee WHERE manager_id IS NOT NULL OR manager_id IS NULL');
        return managers.map(manager => ({
            name: manager.name, // Displayed in the prompt
            value: manager.id   // Used as the value when a manager is selected
        }));
    } catch (error) {
        console.error('Failed to retrieve managers:', error);
        throw error;
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

export default DatabaseQueries;
  