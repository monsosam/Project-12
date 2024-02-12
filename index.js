// Import required modules
import { prompt } from 'inquirer';
import connection from './config/connection.js'; // Adjust the path as necessary
import DatabaseQueries from './queries.js';

// Create an instance of the DatabaseQueries class
const dbQueries = new DatabaseQueries(connection);

// Function to show the main menu
function showMainMenu() {
  prompt([
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
        dbQueries.viewAllDepartments().then(showMainMenu);
        break;
      case 'Add a department':
        dbQueries.promptAddDepartment();
        break;
      case 'View all roles':
        dbQueries.viewAllRoles().then(showMainMenu);
        break;
      case 'Add a role':
        dbQueries.promptAddRole();
        break;
      case 'View all employees':
        dbQueries.viewAllEmployees().then(showMainMenu);
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

// Start the application by showing the main menu
showMainMenu();