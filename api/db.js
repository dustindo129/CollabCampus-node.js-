// Import the MySQL library to interact with MySQL databases
import mysql from 'mysql2';

// Create a connection to the MySQL database using specified credentials
export const db = mysql.createConnection({
    host: "localhost", // Database server host (local machine in this case)
    user: "root", // Username for database access
    password: "Blueshoe1", // Password for database access
    database: "CollabCampus", // Name of the database to connect to
    authPlugins: {
        mysql_native_password: true, // Use MySQL's native password plugin for authentication
    }
}); 
