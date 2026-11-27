import dotenv from "dotenv"; //!dotenv is a Node.js package that reads key-value pairs from a .env file (like PORT=3000 or DATABASE_URL=postgres://...) and loads them into process.env so your code can access them at runtime.
import path from "node:path";//!The node: prefix in import path from "node:path"; explicitly tells Node.js and TypeScript that you are importing Node.js's built-in path module, rather than a third-party npm package named path.

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const rawPort = getRequiredEnv("PORT");
const port = Number(rawPort);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT value: "${rawPort}". Expected an integer between 1 and 65535.`);
}

const config = {
  port,
  connectionString: getRequiredEnv("DATABASE_URL"),
  jwtSecret: getRequiredEnv("JWT_SECRET"),
  jwtExpiresIn: getRequiredEnv("JWT_EXPIRES_IN")
};

export default config;