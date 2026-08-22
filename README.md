# Employee Document Management System

An Employee Document Management System (EDMS) built using the MERN stack that allows organizations to manage employees, departments, managers, and employee documents efficiently.

## Features

- Employee Management
  - Add, update, view, and soft delete employees
  - Search and filter employees
  - Assign employees to departments

- Department Management
  - Create, edit, and delete departments
  - Assign or remove department managers

- Manager Management
  - Promote employees to managers
  - Remove managers automatically when an employee is deleted

- Authentication
  - User login
  - JWT-based authentication
  - Protected routes

- Soft Delete
  - Employees are soft deleted instead of being permanently removed.
  - Manager records and department assignments are automatically updated.

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

---

## Project Structure

```
project/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/employee-document-management.git
```

### Navigate to the project

```bash
cd employee-document-management
```

### Install backend dependencies

```bash
cd server
npm install
```

### Install frontend dependencies

```bash
cd ../client
npm install
```

---

## Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Running the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## API Modules

### Employee

- Create Employee
- Update Employee
- Delete Employee (Soft Delete)
- Get Employee
- Get All Employees

### Department

- Create Department
- Update Department
- Delete Department
- Get Department
- Get All Departments

### Manager

- Assign Manager
- Remove Manager
- Get Manager Details

### Documents

- Upload Document
- Update Document
- Delete Document
- View Documents

---

## Database Models

### Employee

- Name
- Email
- Phone
- Department
- Designation
- Manager Status
- Join Date
- Delete Date
- Active Status

### Department

- Department Name
- Description
- Department Manager

### Manager

- Employee ID
- Department ID

### Document

- Employee ID
- Document Name
- File URL
- Upload Date

---

## Future Improvements

- Role-Based Access Control (RBAC)
- Email Notifications
- Audit Logs
- Bulk Employee Import
- Dashboard Analytics
- Document Versioning
- Two-Factor Authentication

---

## Author

Shourya Verma

---

## License

This project is licensed under the MIT License.
