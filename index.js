// Import required modules
import { prompt } from 'inquirer';
import connection, { end, query } from '../config/connection'; // Adjust the path as necessary
import DatabaseQueries from './queries';

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
        end();
        break;
      default:
        console.log('Invalid action!');
        showMainMenu(); // Show the menu again if the action is not recognized
    }
  }).catch(error => console.error('Error handling the main menu:', error));
}

// Function implementations for database interactions
// These functions should interact with the database and then call showMainMenu() again to return to the main menu

async function viewAllDepartments() {
    try {
        // Execute the query to get all departments
        const [departments] = await query('SELECT * FROM department ORDER BY id ASC');
        console.table(departments); // Display the results in a table format
        
        // Call showMainMenu again to return to the main menu
        // Ensure showMainMenu is accessible here; you might need to import or define it within scope
        showMainMenu();
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Optionally, return to the main menu even in case of an error
        showMainMenu();
      }
}

// Implement other functions (addDepartment, viewAllRoles, etc.) similarly

// Start the application by showing the main menu
showMainMenu();