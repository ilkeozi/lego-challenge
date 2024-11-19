# Lego Challenge

## Overview

The **Lego Challenge** project is a backend system for managing and manipulating virtual Lego boxes, pieces, and sets. It allows users to create Lego sets, add components, and propagate price changes dynamically across nested sets.

This project uses **NestJS** as the framework, **TypeORM** for database interactions, and **PostgreSQL** as the database.

---

## Features

- **Lego Box Management**: Create, update, and manage Lego boxes.
- **Component Handling**: Add and manage pieces or nested boxes within a Lego box.
- **Dynamic Price Updates**: Automatically recalculate prices for parent boxes when a component's price or quantity changes.
- **Event-Driven Architecture**: Leverages events for propagating updates across nested Lego boxes.

---

## Prerequisites

Before starting the project, ensure you have the following installed:

- Node.js >= 18.x
- npm >= 7.x
- PostgreSQL >= 12.x
- Docker (optional for containerized deployment)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ilkeozi/lego-challenge.git
   cd lego-challenge
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory and add the necessary configuration (e.g., database credentials).

---

## Scripts

The project comes with a variety of scripts for building, testing, and running the application.

### Development

- Start the application in development mode with hot-reload:

  ```bash
  npm run start:dev
  ```

### Production

- Build the application for production:

  ```bash
  npm run build
  ```

- Start the application in production:

  ```bash
  npm run start:prod
  ```

### Testing

- Run all tests:

  ```bash
  npm test
  ```

- Run end-to-end tests:

  ```bash
  npm run test:e2e
  ```

- Run tests in watch mode:

  ```bash
  npm run test:watch
  ```

### Linting and Formatting

- Lint the codebase:

  ```bash
  npm run lint
  ```

- Format the codebase:

  ```bash
  npm run format
  ```

### Docker

- Build and run the application using Docker:

  ```bash
  npm run docker:up
  ```

- Stop and clean up the containers:

  ```bash
  npm run docker:down
  ```

---

## Project Structure

```bash
src/
├── app.module.ts          # Root module
├── main.ts                # Application entry point
├── modules/               # Feature modules
│   ├── lego-boxes/        # Lego box management
│   ├── lego-pieces/       # Lego piece management
│   ├── nested-lego-boxes/ # Nested box management
│   └── pricing/           # Pricing logic
├── infrastructure/        # Database entities and migrations
├── core/                  # Core services
├── common/                # Common utilities
test/                      # End-to-end tests
```

---

## Endpoints

Here are some key API endpoints:

### Lego Box Management

- **Create a Lego Box**

  - `POST /lego-challenge/create-box`
  - Payload:

    ```json
    {
      "name": "Classic Bricks Set"
    }
    ```

- **Add Components**

  - `POST /lego-challenge/add-components`
  - Payload:

    ```json
    {
      "parent_item_id": 1,
      "components": [
        {
          "component_type": "piece",
          "component_id": 1,
          "amount": 2
        }
      ]
    }
    ```

---

## Testing Strategy

The project includes comprehensive tests:

- **Unit Tests**: Validate individual functions and services.
- **Integration Tests**: Ensure modules interact as expected.
- **End-to-End Tests**: Validate complete workflows (e.g., creating boxes, adding components, propagating price changes).

Run all tests:

```bash
npm test
```

---

## License

This project is licensed under the **UNLICENSED** license, and it's not open for public use or redistribution.

---

## Contributors

- [Ilker Ozin](mailto:ilker.ozin@selebra.net)
