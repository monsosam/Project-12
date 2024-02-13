// Import required modules
import inquirer from 'inquirer';
import initConnection from './config/connection.js'; // Adjust the path as necessary
import DatabaseQueries from './queries.js';

async function init() {
  try {
    const connection = await initConnection(); // Ensure this is awaited if it's async
    const dbQueries = new DatabaseQueries(connection);
    showMainMenu(dbQueries); // Pass dbQueries to use it in the function
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
  }
}

function promptAddDepartment(dbQueries) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'What is the name of the new department?',
      validate: input => input ? true : 'Department name cannot be empty.'
    }
  ]).then(({ departmentName }) => {
    dbQueries.addDepartment(departmentName)
      .then(() => {
        console.log(`Department added: ${departmentName}`);
        showMainMenu(dbQueries); // Ensure to pass dbQueries back to showMainMenu
      })
      .catch(error => {
        console.error('Error adding department:', error);
        showMainMenu(dbQueries); // Ensure to pass dbQueries back to showMainMenu
      });
  });
}

async function promptAddRole(dbQueries) {
  // Assuming getDepartmentsForChoices() returns [{ name: 'Dept Name', value: deptId }, ...]
  const departments = await dbQueries.getDepartmentsForChoices();

  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of the new role?',
      validate: input => input ? true : 'Role title cannot be empty.'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary for the new role?',
      validate: input => !isNaN(parseFloat(input)) && isFinite(input) ? true : 'Please enter a valid number.'
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Which department does the role belong to?',
      choices: departments
    }
  ]).then(({ title, salary, departmentId }) => {
    dbQueries.addRole(title, salary, departmentId)
      .then(() => {
        console.log(`Role added: ${title}`);
        showMainMenu(dbQueries);
      })
      .catch(error => {
        console.error('Error adding role:', error);
        showMainMenu(dbQueries);
      });
  });
}

// Function to show the main menu
function showMainMenu(dbQueries) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'Add a department',
        'View all roles',
        'Add a role',
        'View all employees',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]).then((answers) => {
    switch (answers.action) {
      case 'View all departments':
        dbQueries.viewAllDepartments().then(() => showMainMenu(dbQueries));
        break;
      case 'Add a department':
        promptAddDepartment(dbQueries);
        break;
      case 'View all roles':
        dbQueries.viewAllRoles().then(showMainMenu);
        break;
      case 'Add a role':
        promptAddRole(dbQueries);
        break;
      case 'View all employees':
        dbQueries.viewAllEmployees().then(employees => {
          showMainMenu(dbQueries)
      }).catch(error => { console.error('Error fetching employees:', error); });
        break;
      case 'Add an employee':
        dbQueries.promptAddEmployee();
        break;
      case 'Update an employee role':
        dbQueries.updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Exiting application...');
        connection.end()
        break;
      default:
        console.log('Invalid action!');
        showMainMenu(); // Show the menu again if the action is not recognized
    }
  }).catch(error => console.error('Error handling the main menu:', error));
}

// Start the application
init();