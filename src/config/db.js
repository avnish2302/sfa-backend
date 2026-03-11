import mysql from "mysql2/promise";

const pool = mysql.createPool({       // creates a connection pool. A pool manages multiple DB connections efficiently 
  host: process.env.DB_HOST,          // databse is running on local database
  user: process.env.DB_USER,          // MySQL username
  password: process.env.DB_PASSWORD,  // MySQL password
  database: process.env.DB_NAME,      // database name we are connecting to
  waitForConnections: true,           // if all connections are busy, wait instead of throwing error
  connectionLimit: 10,                // mmaximun simultaneous DB connections
})

export default pool;