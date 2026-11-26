# DEPLOYMENT GUIDE

## Project: Technician Assignment and Appointment Scheduling (Workflow 4)

### 1. Project Information

| Information | Details |
|---|---|
| Project Name | Technician Assignment and Appointment Scheduling |
| Course | Graduation Specialization 1 |
| Track | SE |
| Workflow | L4 |
| Backend | Node.js, Express.js |
| Frontend | React, Vite |
| Database | PostgreSQL 16 |
| Containerization | Docker, Docker Compose |
| Repository | https://github.com/minhquanzzz/cdtn1-nguyenminhquan-4 |
| Branch | main |
| Version | v1.0 |

### 2. System Requirements

The deployment machine must have the following software installed:

- Git
- Docker Desktop
- Docker Compose

For Windows, Docker Desktop must be started before proceeding with the deployment.

### 3. Obtaining the Project Source Code

Open Terminal or PowerShell and run:

```powershell
git clone https://github.com/minhquanzzz/cdtn1-nguyenminhquan-4.git
```

Navigate to the project directory:

```powershell
cd cdtn1-nguyenminhquan-4
```

To retrieve the specific release version:

```powershell
git checkout v1.0
```

### 4. Environment Variable Configuration

Create a `.env` file from the provided template.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Linux/macOS:**

```bash
cp .env.example .env
```

Open the `.env` file and configure the following environment variables:

| Variable | Description |
|---|---|
| PORT | Backend server port |
| DB_HOST | PostgreSQL host address when running directly |
| DB_PORT | PostgreSQL port |
| DB_NAME | Database name |
| DB_USER | Database username |
| DB_PASSWORD | Database password |
| JWT_SECRET | Secret key used to sign JWT tokens |
| ADMIN_PASSWORD | Administrator account password |

**Important notes:**

- Use a unique and secure password for the database.
- Ensure that `JWT_SECRET` has sufficient length and randomness.
- Set `ADMIN_PASSWORD` to a unique and secure password.
- Do not share the `.env` file.
- Do not commit the `.env` file to GitHub.

### 5. Deployment Using Docker Compose

From the project root directory, run the following command:

```powershell
docker compose up -d --build
```

Docker Compose will deploy the components according to their dependency order:

1. PostgreSQL Database.
2. Database Initialization.
3. Backend API.
4. Frontend Web Application.

The Database Initialization service initializes the database schema and sample data according to the project configuration.

The Backend starts only after the database initialization process has been completed successfully.

The Frontend starts after the Backend reaches a healthy status.

### 6. Accessing the System

| Component | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend Health | http://localhost:3000/health |
| Backend API | http://localhost:3000/api/v1 |

Users can access the Frontend through a web browser to interact with and use the system.

### 7. Administrator Account

The administrator account is configured during the Database Initialization process.

| Information | Value |
|---|---|
| Username | admin |
| Password | The value of `ADMIN_PASSWORD` in the `.env` file |

> **Security Note:** Do not use default passwords in a production environment.

### 8. Docker Management Commands

**View the status of all containers:**

```powershell
docker compose ps
```

**View logs for the entire system:**

```powershell
docker compose logs -f
```

**View Backend logs:**

```powershell
docker compose logs -f backend
```

**View PostgreSQL logs:**

```powershell
docker compose logs -f postgres
```

**View Database Initialization logs:**

```powershell
docker compose logs db-init
```

**Stop the system:**

```powershell
docker compose down
```

**Start the system again:**

```powershell
docker compose up -d
```

### 9. Running Automated Tests

To execute the Node.js automated test suite, ensure that Node.js is installed.

Install the required dependencies from the project root directory:

```powershell
npm ci
```

Then, run the automated tests using the following command:

```powershell
npm test
```

### 10. PostgreSQL Data Management

PostgreSQL data is stored in the following Docker named volume:

`cdtn1-nguyenminhquan-4_postgres_data`

The named volume ensures that database data is preserved when containers are stopped or removed using the following command:

```powershell
docker compose down
```

> **WARNING:** Do not use the following command if you want to preserve the database data.

```powershell
docker compose down -v
```

This command may permanently remove the Docker volume and all associated PostgreSQL data.

### 11. Deployment Summary

The project is packaged using Docker Compose and consists of the following components:

- **PostgreSQL:** Manages and stores application data.
- **Backend:** Handles business logic and provides REST APIs.
- **Frontend:** Provides the user interface for interacting with the system.
- **Database Initialization:** Initializes the database schema and sample data.

---

**Repository:** https://github.com/minhquanzzz/cdtn1-nguyenminhquan-4

**Release Version:** v1.0
