// Import required modules
import inquirer from 'inquirer';
import initConnection from './config/connection.js'; // Adjust the path as necessary
import databaseQueries from './queries.js';
import editorQueries from './editor.js'


async function init() {
  try {
    const connection = await initConnection(); // Ensure this is awaited if it's async
    showMainMenu(connection); // Pass dbQueries to use it in the function
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
  }
}

// Function to show the main menu
function showMainMenu(db) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all Departments',
        'View all Roles',
        'View Employee Information',
        'Edit Employee Database',
        'Exit'
      ]
    }
  ]).then((answers) => {
    switch (answers.action) {

      case 'View all Departments':
        databaseQueries.viewAllDepartments(db);
        break;

      case 'View all roles':
        databaseQueries.viewAllRoles(db);
        break;

      case 'View Employee Information':
        viewEmployeeInformation(db);
        break;

      case 'Edit Employee Database':
        editEmployeeDatabase(db);
        break;

      case 'Exit':
        console.log('Exiting application...');
        connection.end()
        break;

      default:
        console.log('Invalid action!');
        showMainMenu(db); // Show the menu again if the action is not recognized
    }
  }).catch(error => console.error('Error handling the main menu:', error));
}

function viewEmployeeInformation(dbQueries) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to view?',
      choices: [
        'View all Employee Names',
        'View Employees by Role',
        'View Employees by Department',
        'View Employee Managers',
        'View Employee Salary',
        'View all Employee Information',
        'Exit'
      ]
    }
  ]).then((answers) => {
    switch (answers.action) {
      case 'View all Employee Names':
        databaseQueries.viewAllEmployeeNames(db);
        break;

      case 'View Employees by Role':
        databaseQueries.viewEmployeeRole(db);
        break;

      case 'View Employees by Department':
        databaseQueries.viewEmployeeDepartment(db);
        break;

      case 'View Employee Managers':
        databaseQueries.viewEmployeeManager(db)
        break;

      case 'View Employee Salary':
        databaseQueries.viewEmployeeSalary(db);
        break;

      case 'View all Employee Information':
        databaseQueries.viewEmployeeInfo(db);
        break;

      case 'Exit':
        console.log('Exiting...');
        showMainMenu();
        break;

      default:
        console.log('Invalide Choice!');
        viewEmployeeInformation(db);
    }
  })
  .catch(error => console.error('Error with User Inquirer', error));
};

function editEmployeeDatabase(db) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to Edit?',
      choices: [
        'Add Employee',
        'Update Employee', 
        'Remove Employee', 
        'Add Role', 
        'Remove Role', 
        'Add Department', 
        'Remove Department', 
        'Exit'
      ]
    }
  ]).then((answers) => {
    switch (answers.action) {
      case 'Add Employee':
        editorQueries.addEmployee(db); // Replace with your operation to add an employee
        break;

      case 'Update Employee':
        editorQueries.updateEmployee(db); // Replace with your action to update employee's data
        break;

      case 'Remove Employee':
        editorQueries.removeEmployee(db); // Perform an employee removal task
        break;

      case 'Add Role':
        editorQueries.addRole(db); // A mechanism to register a new role in the structure
        break;

      case 'Remove Role':
        editorQueries.removeRole(db); // A task to take away an existing role from the status
        break;

      case 'Add Department':
        editorQueries.addDepartment(db); // A technique to ensure a new division or arm
        break;

      case 'Remove Department':
        editorQueries.removeDepartment(); // Remove a batch, part, or old management zone
        break;

      case 'Exit':
        console.log('Exiting...');
        showMainMenu(); // Function to present the main form of the role or type back
        break;

      default:
        console.log('Invalid Choice!'); 
        editEmployeeDatabase(db); // Possibly this gets back to the domain i.e., sends you to the method's sketch again
    }
  })
  .catch(error => console.error('Error with Employee Database Edit Flow', error));
};

// Start the application
init();