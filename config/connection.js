// Importing dotenv and mysql2 packages
require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection to the database using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});


// Export the connection
module.exports = connection;