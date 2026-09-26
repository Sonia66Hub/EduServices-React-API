<p align="center">
  <em>“🎓 Education is the most powerful weapon which you can use to change the world.”</em><br/>
  — Nelson Mandela ❤️
</p>

# 🎓 Education Services Management System (ESM)

<p align="center">
  <b>A modern, full-stack educational management platform built with <br/>ASP.NET Core + React (Vite)</b><br/>
  📚 Manage students, teachers, departments, courses, subjects, and attendance — all in one centralized system.
</p>

---

## 🌟 Why this project?

Educational institutions often struggle with fragmented systems and manual data entry.  
This project brings all academic operations under one robust, scalable, and modern web solution.

- ⚡ Lightning fast **React + Vite** frontend  
- 🔐 Secure **.NET Core backend with JWT Auth & Role-Based Access**  
- 📊 Streamlined student, teacher & attendance management  
- 🛠️ Clean architecture for scalability & maintainability  

---

## 🏗️ Tech Stack

| Layer        | Technology Used                   |
|--------------|-----------------------------------|
| **Frontend** | React, Vite, Bootstrap            |
| **Backend**  | ASP.NET Core (.NET 7/8), EF Core  |
| **Database** | SQL Server                        |
| **Auth**     | ASP.NET Identity + JWT            |

---

## 📂 Project Structure

/Education-ServicesApiwithReact/ # Root
├── backend/ # ASP.NET Core Web API
└── frontend/ # React App (Vite)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mdshohagkhan/Education-ServicesApiwithReact.git
cd Education-ServicesApiwithReact
```
### 2️⃣ Backend Setup (ASP.NET Core)
cd backend
# Update connection string in appsettings.json
# Run the database migrations:
dotnet ef database update
# Start the API server
dotnet run
# 👉 Runs at: https://localhost:5000
----
### 3️⃣ Frontend Setup (React + Vite)
cd ../frontend
npm install
# Create a .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
# 👉 Runs at: http://localhost:3000
🔑 Demo Credentials
📧 Email: admin@edu.com
🔐 Password: Admin123!
🧑‍💼 Role: Admin
----

### ✨ Features

🔐 Secure login & registration with JWT

🧑‍💼 Role-based access control: Admin, Teacher, Student

🏫 Manage departments, courses, and teachers

📚 Subject allocation and viewing

🧑‍🎓 Student CRUD with profile image upload

📝 Attendance management (by course & date)

📊 Responsive and intuitive UI

----
⚙️ Environment Variables
Backend (in appsettings.json)
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=EduManageDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
---
Frontend (.env)
VITE_API_URL=http://localhost:5000/api
----
📦 Build & Deployment
dotnet publish -c Release
## Frontend:
npm run build
---
📸 Screenshots
| Dashboard                                      | Student Management                           | Attendance                                       |
| ---------------------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| ![Dashboard](public/screenshots/dashboard.png) | ![Students](public/screenshots/students.png) | ![Attendance](public/screenshots/attendance.png) |
---

🎥 Demo Video

🔹 Watch Full Walkthrough on YouTube
👉 https://youtu.be/8HX-dVhEnjU?si=D4RaLoSEgY7QXsbp

---
🤝 Contribution Guide

Fork the repository

Create a new branch (feature/your-feature)

Commit your changes

Push and open a Pull Request 🎉

📜 License

This project is licensed under the MIT License – feel free to use, modify, and enhance!

📫 Contact
<p align="center"> Developed with ❤️ by <strong>Md Shohag Miah</strong><br/> 📧 <a href="mailto:devshohag3@gmail.com">devshohag3@gmail.com</a><br/> 🌐 <a href="https://github.com/mdshohagkhan" target="_blank">GitHub Profile</a> </p> ```


