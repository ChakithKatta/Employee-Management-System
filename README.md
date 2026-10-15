
## 1. Project Overview

The **Employee Management System (EMS)** is a full-stack, enterprise-grade web application designed for administrators to manage organizational employee records seamlessly. The application features a responsive React user interface, RESTful APIs implemented in Spring Boot, Spring Data JPA persistence (with zero-configuration embedded H2 and pluggable MySQL support), interactive Swagger/OpenAPI documentation, unit testing with JUnit 5 & Mockito, CSV export, department management, and administrative authentication.

---

## 2. Technology Stack

- **Backend:**
  - Java 17 (LTS)
  - Spring Boot 3.2.5
  - Spring Data JPA / Hibernate
  - Maven 3.9+
  - H2 Database (Default: zero-config instant local execution)
  - MySQL 8.0 (Supported via profile `application-mysql.yml` & Docker)
  - SpringDoc OpenAPI 2.3.0 (Interactive Swagger UI documentation)
- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Lucide React Icons
  - Axios HTTP Client
- **Testing:**
  - JUnit 5 & Mockito (100% pass on service-layer business logic tests)
- **Containerization & Devops:**
  - Docker & Docker Compose setup

---

## 3. Features Implemented

### A. Employee Management (All Required Fields)
Each employee record contains:
1. `Employee ID` (e.g., `EMP-1001` - unique, auto-generated or custom)
2. `Full Name`
3. `Email Address` (unique, format validated)
4. `Phone Number` (format validated)
5. `Department` (linked with department records)
6. `Designation`
7. `Date of Joining`
8. `Salary` (annual compensation formatted in currency)
9. `Employment Status` (`ACTIVE` or `INACTIVE`)

### B. Core Operations
- **Add Employee:** Modal form with comprehensive validation and auto ID generator.
- **View Employee Details:** Modal showing contact info, designation, salary, department, joining date, and audit timestamps.
- **Edit Employee:** Modal form to modify existing employee records with duplicate email/ID safety checks.
- **Delete Employee with Confirmation:** Safeguard confirmation dialog before permanent deletion.
- **List All Employees:** Responsive table (desktop) and card view (mobile).
- **Search:** Instant search across employee name, email, or employee ID.
- **Filter:** Dynamic dropdown filters by Department and Employment Status.
- **Pagination:** Configurable page size (5, 10, 20, 50), page indicator, and prev/next controls.
- **Sorting:** Dynamic column sorting by ID, Name, Department, Date of Joining, and Salary.

### C. Bonus Enhancements
- [x] **Login and Basic Authentication:** Admin login (`admin` / `admin123`) returning token and session state.
- [x] **Department Management:** Dedicated modal to create, list, and delete organizational departments with real-time employee counts.
- [x] **Export Employee Data to CSV:** One-click download of all employee data as an RFC 4180-compliant CSV file.
- [x] **Docker Compose Setup:** Full-stack multi-container orchestration (`mysqldb` + `backend` + `frontend`).
- [x] **Unit Testing:** 20 test cases covering service layer business logic using JUnit 5 and Mockito.
- [x] **Zero-Config Execution:** Frontend is prebuilt and packaged inside the Spring Boot JAR, running the entire stack on `http://localhost:8080` without manual steps.

---

## 4. Quick Start (Run Locally Out-of-the-Box)

The application is preconfigured so reviewers can run it immediately without needing to configure external database credentials or modify code.

### Option 1: Run the Prepackaged Executable (Fastest)

Prerequisites: **Java 17 or later**

1. Open PowerShell / Command Prompt and navigate to the project directory:
   ```powershell
   cd "backend"
   java -jar target/employee-management-system-1.0.0.jar
   ```
   *(Or on Windows, simply double-click `start.bat` in the project root)*

2. Open your web browser:
   - **Web Application UI:** [http://localhost:8080](http://localhost:8080)
   - **Swagger / OpenAPI Documentation:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - **H2 Database Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:mem:emsdb`, User: `sa`, Password: *(empty)*)

---

### Option 2: Run Backend and Frontend in Development Mode

#### Running Backend:
```powershell
cd backend
mvn spring-boot:run
```
*(Or on Windows using the included wrapper: `.\mvnw.cmd spring-boot:run`)*

#### Running Frontend (Vite Dev Server):
Prerequisites: **Node.js 18+ and npm**
```powershell
cd frontend
npm install
npm run dev
```
The frontend dev server will launch at: [http://localhost:3000](http://localhost:3000) (with automatic proxying to `http://localhost:8080`).

---

### Option 3: Run with MySQL Database

1. Ensure MySQL is running on port 3306.
2. Initialize database schema and initial data:
   ```powershell
   mysql -u root -p < schema.sql
   ```
3. Start Spring Boot with MySQL profile:
   ```powershell
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```
   *(Environment variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` can be set as needed)*

---

### Option 4: Run with Docker Compose

Prerequisites: **Docker & Docker Compose**

```powershell
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- MySQL: Port 3306

---

## 5. Running Unit Tests

The backend includes 20 comprehensive unit tests using JUnit 5 and Mockito that test:
- Employee creation, unique email validation, unique employee ID validation, and auto-ID generation.
- Employee retrieval by ID and by code.
- Employee updating and conflict checks.
- Employee deletion and not-found exception handling.
- Dynamic search and filter specification pagination.
- CSV export data formatting and header escaping.
- Department CRUD operations and employee count calculations.
- Dashboard statistics computation.

To execute tests:
```powershell
cd backend
mvn test
```
**Test Results:**
```
[INFO] Running com.kloudspot.ems.service.DepartmentServiceTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.kloudspot.ems.service.EmployeeServiceTest
[INFO] Tests run: 15, Failures: 0, Errors: 0, Skipped: 0
[INFO] Results: Tests run: 20, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 6. REST API Reference

All API responses follow a uniform JSON structure:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "timestamp": "2026-10-15T11:00:00"
}
```

### Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/employees` | List employees with search, department/status filter, pagination & sorting |
| `GET` | `/api/employees/{id}` | Get employee details by database ID |
| `GET` | `/api/employees/code/{employeeId}` | Get employee details by Employee ID (e.g. `EMP-1001`) |
| `POST` | `/api/employees` | Create a new employee record |
| `PUT` | `/api/employees/{id}` | Update an existing employee record |
| `DELETE` | `/api/employees/{id}` | Delete an employee record |
| `GET` | `/api/employees/export/csv` | Download all employees as a CSV file |
| `GET` | `/api/employees/stats` | Get dashboard summary metrics (Total, Active, Inactive, Departments) |
| `GET` | `/api/departments` | List all departments with employee counts |
| `POST` | `/api/departments` | Create a new department |
| `DELETE` | `/api/departments/{id}` | Delete a department |
| `POST` | `/api/auth/login` | Administrator login (Default: `admin` / `admin123`) |

### Query Parameters for `/api/employees`:
- `search`: Keyword to search across `fullName`, `email`, and `employeeId` (case-insensitive)
- `department`: Filter by department name (or `ALL`)
- `status`: Filter by status (`ACTIVE`, `INACTIVE`)
- `page`: Page index (default: `0`)
- `size`: Page size (default: `10`)
- `sortBy`: Sort column (`id`, `fullName`, `employeeId`, `salary`, `dateOfJoining`, `department`)
- `sortDir`: Sort direction (`asc`, `desc`, default: `desc`)

---

## 7. Sample API Requests & Postman Collection

Import `postman_collection.json` directly into Postman to run preconfigured requests for all endpoints.

### Sample: Create Employee (`POST /api/employees`)
```json
{
  "employeeId": "EMP-1099",
  "fullName": "Kavya Sen",
  "email": "kavya.sen@kloudspot.com",
  "phoneNumber": "+91 9876543290",
  "department": "Engineering",
  "designation": "Staff Software Engineer",
  "dateOfJoining": "2024-02-01",
  "salary": 1800000.00,
  "employmentStatus": "ACTIVE"
}
```

### Sample: Successful Response
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 13,
    "employeeId": "EMP-1099",
    "fullName": "Kavya Sen",
    "email": "kavya.sen@kloudspot.com",
    "phoneNumber": "+91 9876543290",
    "department": "Engineering",
    "designation": "Staff Software Engineer",
    "dateOfJoining": "2024-02-01",
    "salary": 1800000.00,
    "employmentStatus": "ACTIVE",
    "createdAt": "2026-10-15T11:08:45",
    "updatedAt": "2026-10-15T11:08:45"
  },
  "timestamp": "2026-10-15T11:08:45"
}
```

---

## 8. Project Structure

```
Employee Management System/
├── backend/
│   ├── pom.xml
│   ├── mvnw.cmd
│   ├── mvnw
│   ├── Dockerfile
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/kloudspot/ems/
│   │   │   │   ├── EmployeeManagementSystemApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── OpenApiConfig.java
│   │   │   │   │   ├── WebCorsConfig.java
│   │   │   │   │   └── DataInitializer.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── EmployeeController.java
│   │   │   │   │   ├── DepartmentController.java
│   │   │   │   │   └── AuthController.java
│   │   │   │   ├── dto/
│   │   │   │   ├── exception/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-mysql.yml
│   │   │       ├── schema.sql
│   │   │       └── static/ (Integrated frontend assets)
│   │   └── test/
│   │       └── java/com/kloudspot/ems/service/
│   │           ├── EmployeeServiceTest.java
│   │           └── DepartmentServiceTest.java
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── Dockerfile
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── api/employeeApi.ts
│       ├── types/employee.ts
│       └── components/
│           ├── Navbar.tsx
│           ├── StatsCards.tsx
│           ├── EmployeeList.tsx
│           ├── EmployeeFormModal.tsx
│           ├── EmployeeDetailsModal.tsx
│           ├── DeleteConfirmModal.tsx
│           ├── DepartmentManagementModal.tsx
│           ├── LoginModal.tsx
│           └── Toast.tsx
├── schema.sql (Standalone database creation and seed script)
├── docker-compose.yml (Multi-container Docker orchestration)
├── postman_collection.json (Preconfigured Postman API collection)
├── start.bat (One-click Windows starter)
└── README.md
```

---

## 9. Submission Details

- **Candidate Submission:** Source code and deliverables in project root.
- **Recipient:** `manjunatha.v@kloudspot.com`
- **Mandatory HR Recipient:** `hr.team@kloudspot.com`
