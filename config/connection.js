// Importing dotenv and mysql2 packages
import dotenv from 'dotenv';
import { createConnection } from 'mysql2/promise';


// Initialize dotenv
dotenv.config();

// Create a connection to the database using environment variables
async function initConnection() {
  try {
    // Using createConnection to establish a new connection
    const connection = await createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });
    console.log("Database connection successfully established.");
    return connection;
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    throw error; // Rethrow to handle it in the calling context
  }
}


// Export the connection
export default initConnection;