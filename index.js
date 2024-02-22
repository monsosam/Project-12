// Import required modules
import inquirer from 'inquirer';
import initConnection from './config/connection.js'; // Adjust the path as necessary
import databaseQueries from './selector/queries.js';
import editorQueries from './selector/editor.js'


async function init() {
  try {
    const connection = await initConnection(); // Ensure this is awaited if it's async
    showMainMenu(connection); // Pass dbQueries to use it in the function
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
  }
}

async function returnMenu(db) {
  setImmediate(async () => {
    try {
      // `inquirer.prompt` is awaited inside a try block to catch any errors that might occur during prompting.
      const answer = await inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'Return to main menu?',
        choices: [
          'Yes',
          'No'
        ]
      }]);
      switch (answer.choice) {

        case 'Yes':
        console.log('\n');
        await showMainMenu(db);
        break;

        case 'No':
        console.log('Exiting application...');
        await db.end()
        break;

        default:
        console.log('Invalid action!');
      }
        
      
    } catch (error) {
      // Handle errors that might occur during the prompt or the `showMainMenu` execution.
      console.error('An error occurred:', error);
    }
  });
}

// Function to show the main menu
async function showMainMenu(db) {
  try {
    const answers = await inquirer.prompt([
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
  ]);

  switch (answers.action)  {

      case 'View all Departments':
        await databaseQueries.viewAllDepartments(db);
        await returnMenu(db);
        break;

      case 'View all Roles':
        await databaseQueries.viewAllRoles(db);
        await returnMenu(db);
        break;

      case 'View Employee Information':
        viewEmployeeInformation(db);
        break;

      case 'Edit Employee Database':
        editEmployeeDatabase(db);
        break;

      case 'Exit':
        console.log('Exiting application...');
        await db.end()
        break;

      default:
        console.log('Invalid action!');
    }
    //await returnMenu(db);
    //console.log('\n');
    
  } catch (error) {
    console.error('Error with the main menu:', error);

  }
}

async function viewEmployeeInformation(db) {
  try {
    const view = await inquirer.prompt([
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
    ]);

    switch (view.action) {
      case 'View all Employee Names':
        await databaseQueries.viewAllEmployeeNames(db);
        await returnMenu(db);
        break;

      case 'View Employees by Role':
        await databaseQueries.viewEmployeeRole(db);
        await returnMenu(db);
        break;

      case 'View Employees by Department':
        await databaseQueries.viewEmployeeDepartment(db);
        await returnMenu(db);
        break;

      case 'View Employee Managers':
        await databaseQueries.viewEmployeeManager(db);
        await returnMenu(db);
        break;

      case 'View Employee Salary':
        await databaseQueries.viewEmployeeSalary(db);
        await returnMenu(db);
        break;

      case 'View all Employee Information':
        await databaseQueries.viewEmployeeInfo(db);
        await returnMenu(db);
        break;

      case 'Exit':
        console.log('Exiting...');
        await showMainMenu();
        break;

      default:
        console.log('Invalid Choice!');
    }
  } catch (error) {
    console.error('Error with User Inquirer', error);
  }
}

async function editEmployeeDatabase(db) {
  try {
    const select = await inquirer.prompt([
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
    ]);

    switch (select.action) {
      case 'Add Employee':
        await editorQueries.addEmployee(db);
        await returnMenu(db);
        break;

      case 'Update Employee':
        await editorQueries.updateEmployee(db);
        await returnMenu(db);
        break;

      case 'Remove Employee':
        await editorQueries.removeEmployee(db);
        await returnMenu(db);
        break;

      case 'Add Role':
        await editorQueries.addRole(db);
        await returnMenu(db);
        break;

      case 'Remove Role':
        await editorQueries.removeRole(db);
        await returnMenu(db);
        break;

      case 'Add Department':
        await editorQueries.addDepartment(db);
        await returnMenu(db);
        break;

      case 'Remove Department':
        await editorQueries.removeDepartment(db);
        await returnMenu(db);
        break;

      case 'Exit':
        console.log('Exiting...');
        await showMainMenu();
        break;

      default:
        console.log('Invalid Choice!');
    }

  } catch (error) {
    console.error('Error with Employee Database Edit Flow', error);
  }
}

// Start the application
init();