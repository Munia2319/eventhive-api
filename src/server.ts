import app from "./app";
import config from "./config/index";
import { testDatabaseConnection } from './db/index';


const startServer = async () => {
  try {

    //* DatabaseConnection Test
    await testDatabaseConnection();

    //*  Check that required infrastructure is ready (PostgreSQL pool check goes here later)
    const port = config.port ;

    //*  Start the Express server on the configured PORT and log confirmation
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    // * Log the startup error and exit with a non-zero status code
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

//* Invoke startServer to boot the application
startServer();

//! NB:Separating app.ts (middleware and routes) from server.ts (app.listen()) keeps your Express app modular, lets you run async startup checks before accepting traffic, and avoids port/open-handle conflicts when importing app in tests.