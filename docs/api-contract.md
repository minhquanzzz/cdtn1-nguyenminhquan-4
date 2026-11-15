
# API DOCUMENTATION

## 1. Project Overview

- Project: Technician Assignment and Appointment Scheduling
- Course: Graduation Project 1
- Track: Software Engineering (SE)
- Backend: Node.js, Express.js
- Database: PostgreSQL
- API Base URL: http://localhost:3000/api/v1
- Data Format: JSON

## 2. System Endpoints

### 2.1 Home

- Method: GET
- Endpoint: `/`
- Description: Display backend information and available endpoint groups.
- Success Status: 200 OK

### 2.2 Health Check

- Method: GET
- Endpoint: `/health`
- Description: Check backend and PostgreSQL connectivity.
- Success Status: 200 OK
- Error Status: 503 Service Unavailable

## 3. Authentication APIs

Base URL: `/api/v1/auth`

### 3.1 Admin Login

- Method: POST
- Endpoint: `/api/v1/auth/login`
- Authentication: Not required.
- Description: Authenticate an administrator account.
- Request Body: `username`, `password`.
- Success Status: 200 OK
- Error Status: 400, 401, 403, 500

JWT token expiration: 8 hours.

## 4. Ticket APIs

Base URL: `/api/v1/tickets`

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/` | Get all tickets | 200 |
| GET | `/:id` | Get ticket by ID | 200 |
| POST | `/` | Create a ticket | 201 |
| PUT | `/:id` | Update a ticket | 200 |
| DELETE | `/:id` | Delete a ticket | 200 |

## 5. Technician Assignment APIs

Base URL: `/api/v1/assignments`

Authentication: Bearer Token required.

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/` | Get all assignments | 200 |
| GET | `/suggest/:ticketId` | Suggest suitable technicians | 200 |
| POST | `/` | Assign a technician to a ticket | 201 |

Assignment rules include technician skills, service center, active status, workload, and appointment availability.

## 6. Appointment APIs

Base URL: `/api/v1/appointments`

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/` | Get all appointments | 200 |
| GET | `/:id` | Get appointment by ID | 200 |
| POST | `/` | Create an appointment | 201 |
| PUT | `/:id` | Update an appointment | 200 |
| PATCH | `/:id/cancel` | Cancel an appointment | 200 |
| DELETE | `/:id` | Delete an appointment | 200 |

## 7. Technician APIs

Base URL: `/api/v1/technicians`

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/` | Get all technicians | 200 |
| GET | `/:id` | Get technician by ID | 200 |
| POST | `/` | Create a technician | 201 |
| PUT | `/:id` | Update a technician | 200 |
| DELETE | `/:id` | Delete a technician | 200 |

## 8. Technician Skill APIs

Base URL: `/api/v1/technicians/:technicianId/skills`

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/` | Get all technician skills | 200 |
| GET | `/:categoryId` | Get skill by category ID | 200 |
| POST | `/` | Add a technician skill | 201 |
| PUT | `/:categoryId` | Update a technician skill | 200 |
| DELETE | `/:categoryId` | Delete a technician skill | 200 |

## 9. Common HTTP Status Codes

| Status | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required or invalid credentials |
| 403 | Access forbidden |
| 404 | Resource or endpoint not found |
| 409 | Resource conflict |
| 500 | Internal server error |
| 503 | Database unavailable |

## 10. Authentication Header

Protected assignment endpoints require:

`Authorization: Bearer <access_token>`

## 11. CORS Configuration

Allowed frontend origins:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Allowed HTTP methods:

GET, POST, PUT, PATCH, DELETE, OPTIONS.

## 12. Notes

- All request and response bodies use JSON.
- The login endpoint returns a JWT token.
- The assignment endpoints require authentication.
- Request fields and detailed response schemas must match the actual service implementation.
- Database credentials and JWT secrets must not be exposed.
