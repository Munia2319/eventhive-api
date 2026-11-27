# Event Hive API

A TypeScript and Express REST API for managing Event Hive application resources.

## Requirements

- Node.js 20 or later
- PostgreSQL
- npm

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with the PostgreSQL connection and secrets for your environment.

4. Run the database migration in `src/migrations/`.

5. Start the development server:

   ```bash
   npm run dev
   ```

The API starts on `http://localhost:<PORT>` by default.

## Available Scripts

- `npm run dev` - Start the development server with file watching.
- `npm run build` - Compile TypeScript into `dist/`.
- `npm start` - Run the compiled application.
- `npm run typecheck` - Check types without generating output.
- `npm test` - Build and run tests.
- `npm run check` - Run type checking and tests.

## Project Structure

```text
src/
  config/       Environment configuration
  db/           PostgreSQL connection and database utilities
  errors/       Application error types
  middlewares/  Express middleware
  migrations/   SQL database migrations
  modules/      Feature-specific routes, controllers, services, and repositories
  types/        Shared TypeScript types
  utils/        Shared utilities
  app.ts        Express application configuration
  server.ts     Server startup and database health check
tests/          Automated tests
dist/           Generated build output
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | HTTP port for the API |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used for access tokens |
| `REFRESH_SECRET` | Secret used for refresh tokens |
