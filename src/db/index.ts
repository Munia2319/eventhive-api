
import {Pool} from "pg";
import config from "../config/index"
import "dotenv/config";

export const pool=new Pool({connectionString:config.connectionString});

export const testDatabaseConnection=async () => {
    try {
        await pool.query("SELECT NOW()");//? returns current data and time on the database server 
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection failure:", error);
        throw error;
    }
}