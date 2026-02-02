# 🌍 Travel Planner

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

> **Diploma Project:** A backend system for optimizing travel routes using meta-heuristic algorithms.

## 📖 Overview

The **Travel Planner API** is a system designed to help travelers create optimal routes through historic places based on specific constraints (time and budget). The core of the application lies in its ability to solve the **Orienteering Problem** using different algorithmic approaches.

The system allows users to select between a fast heuristic method (Greedy) and a complex meta-heuristic method (Ant Colony Optimization) to maximize the "historic value" of the trip.

---

## 🚀 Deployment & Demo

The application is deployed on Heroku. You can test the API endpoints directly via the interactive Swagger documentation.

| Service | Status | Link | Description |
| :--- | :--- | :--- | :--- |
| **API Documentation** | 🟢 **Live** | [**Open Swagger UI**](https://travel-planner-nestjs-4b0c7e671bb2.herokuapp.com/api/docs) | Interactive API Docs |
| **Backend API** | 🟢 **Live** | [Heroku App](https://travel-planner-nestjs-4b0c7e671bb2.herokuapp.com/api) | Base API URL |
| **Frontend** | ⏳ *Pending* | *Coming Soon* | React Client |

---

## ✨ Key Features

* **Historic Places Database:** CRUD operations for locations with coordinates, visit cost, and historic value.
* **Trip Planning:**
    * Set maximum budget (Cost limit).
    * Set maximum duration (Time limit).
    * Choose an optimization algorithm.
* **Route Calculation:** Automatic generation of the optimal path.
* **Swagger Documentation:** Fully documented endpoints with DTO examples.

---

## 🧠 Algorithms Implemented

This project implements two distinct algorithms to solve the route optimization problem:

### 1. Greedy Algorithm
* **Type:** Heuristic.
* **Logic:** At each step, it chooses the locally optimal choice (the "best" next place based on value/cost ratio) without worrying about the global optimum.
* **Use case:** Fast calculation, good for simple routes.

### 2. Ant Colony Optimization (ACO)
* **Type:** Meta-heuristic.
* **Logic:** Simulates the behavior of ants searching for food. "Ants" explore paths and leave "pheromones" on successful routes. Over multiple iterations, the optimal path emerges based on pheromone concentration.
* **Parameters:**
    * `Alpha`: Pheromone importance.
    * `Beta`: Heuristic information importance.
    * `Evaporation Rate`: How quickly pheromones disappear.
    * `Iterations`: Number of cycles.

---

## 🛠 Tech Stack

* **Framework:** [NestJS](https://nestjs.com/) (Node.js)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** PostgreSQL
* **ORM:** [Prisma](https://www.prisma.io/)
* **Documentation:** Swagger (OpenAPI)
* **Validation:** class-validator & class-transformer
* **Deployment:** Heroku

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/travel-planner.git](https://github.com/your-username/travel-planner.git)
cd travel-planner/server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `server` root directory and add your database connection string:
```
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 4. Database Setup
Generate Prisma client and push the schema to your database:
```bash
npx prisma generate
npx prisma db push
# Optional: Seed the database with initial data
# npx prisma db seed
```

### 5. Run the server
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The server will start at `http://localhost:3000`.
Swagger docs will be available at `http://localhost:3000/api/docs`.

## 📂 Project Structure
```
src/
├── algorithms/       # Greedy & Ant Colony implementations
├── historic-places/  # Places management module
├── trips/            # Trip creation and calculation logic
├── users/            # User management
├── prisma/           # Database service
├── common/           # Shared DTOs and utilities
└── main.ts           # Application entry point
```
