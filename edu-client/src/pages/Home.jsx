import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="main-title">Welcome to EduManage System</h1>
        <p className="sub-title">
          Simplifying academic management — from departments to attendance.
        </p>
        <div className="home-buttons">

          <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
            Login
          </Button>

          <Button as={Link} to="/register" variant="outline-primary" size="lg">
            Register
          </Button>
        </div>
      </header>

      <section className="info-section">
        <div className="info-card">
          <h3>🎓 Departments</h3>
          <p>Manage your institution's structure by adding, editing, or removing academic departments. Each department can be linked to multiple courses and teachers.</p>
        </div>
        <div className="info-card">
          <h3>👩‍🏫 Teachers</h3>
          <p>Keep a record of all your faculty members. Assign teachers to courses and view their associated subjects to ensure smooth academic flow.</p>
        </div>
        <div className="info-card">
          <h3>📘 Courses</h3>
          <p>Design your institution's curriculum. Define courses, assign teachers, and connect them to subjects and students easily.</p>
        </div>
        <div className="info-card">
          <h3>🧑‍🎓 Students</h3>
          <p>Register students, manage their profiles, track enrollments and attendance. A central place for all student information.</p>
        </div>
        <div className="info-card">
          <h3>📚 Subjects</h3>
          <p>Create and organize subjects under specific courses. Assign subjects to teachers and link with student enrollments.</p>
        </div>
        <div className="info-card">
          <h3>📝 Attendance</h3>
          <p>Mark daily attendance for each student per course. Generate attendance reports and keep a history of participation.</p>
        </div>
      </section>

      <footer className="home-footer text-center py-4 mt-5 border-top shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <p className="mb-1 text-dark fw-semibold">
            &copy; {new Date().getFullYear()} <span className="text-primary">EduManage</span>. All rights reserved.
          </p>
          <p className="mb-0 text-muted small" style={{ letterSpacing: '0.5px' }}>
            Designed & Developed with <span className="text-danger">❤️</span> by <strong className="text-dark">SONIA YESMIN</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;


