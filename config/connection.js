// Importing dotenv and mysql2 packages
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Initialize dotenv
dotenv.config();

// Create a connection to the database using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});


// Export the connection
export default connection;