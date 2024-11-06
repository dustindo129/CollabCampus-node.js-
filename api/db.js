// Import the mysql2 library to establish a connection with the MySQL database
import mysql from 'mysql2';

// Create a database connection using specified configuration details
export const db = mysql.createConnection({
    host: "localhost", // Host where the database server is running (local machine in this case)
    user: "root", // Username to authenticate with the database
    password: "Blueshoe1", // Password for the specified database user
    database: "CollabCampus", // Name of the database to connect to
    authPlugins: {
        mysql_native_password: true, // Use MySQL's native password authentication plugin
    }
}); 
