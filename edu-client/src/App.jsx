// import React, { useContext } from 'react';
// import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
// import { Container, Nav, Navbar } from 'react-bootstrap';
// import AuthContext from './context/AuthProvider';
// import PrivateRoute from './routes/PrivateRoute';
// import Login from './components/Auth/Login';
// import Register from './components/Auth/Register';

// // All Components
// import Home from './pages/Home';
// import DepartmentList from './components/Department/DepartmentList';
// import DepartmentForm from './components/Department/DepartmentForm';
// import DepartmentView from './components/Department/DepartmentView';
// import TeacherList from './components/Teacher/TeacherList';
// import TeacherForm from './components/Teacher/TeacherForm';
// import TeacherView from './components/Teacher/TeacherView';
// import CourseList from './components/Course/CourseList';
// import CourseForm from './components/Course/CourseForm';
// import CourseView from './components/Course/CourseView';
// import SubjectList from './components/Subject/SubjectList';
// import SubjectForm from './components/Subject/SubjectForm';
// import SubjectView from './components/Subject/SubjectView';
// import StudentList from './components/Student/StudentList';
// import StudentForm from './components/Student/StudentForm';
// import StudentView from './components/Student/StudentView';
// import EnrollmentList from './components/Enrollment/EnrollmentList';
// import EnrollmentForm from './components/Enrollment/EnrollmentForm';
// import EnrollmentView from './components/Enrollment/EnrollmentView';
// import AttendanceList from './components/Attendance/AttendanceList';
// import AttendanceForm from './components/Attendance/AttendanceForm';
// import AttendanceView from './components/Attendance/AttendanceView';

// // Service functions
// import { deleteDepartment } from './services/departmentService';
// import { deleteTeacher } from './services/teacherService';
// import { deleteCourse } from './services/courseService'; // <-- এই লাইনটি নিশ্চিত করুন
// import { deleteSubject } from './services/subjectService'; 
// import { deleteStudent } from './services/studentService';
// import { deleteEnrollment } from './services/enrollmentService';
// import { deleteAttendance } from './services/attendanceService';

// import './App.css';

// const AppContent = () => {
//     const { currentUser, logout } = useContext(AuthContext);
//     const navigate = useNavigate();

//     return (
//         <>
//             <Navbar bg="warning" variant="dark" expand="lg">
//                 <Container>
//                     <Navbar.Brand as={Link} to="/">Education System</Navbar.Brand>
//                     <Navbar.Toggle aria-controls="main-navbar" />
//                     <Navbar.Collapse id="main-navbar">
//                         <Nav className="me-auto">
//                             <Nav.Link as={Link} to="/">Home</Nav.Link>
//                             {currentUser && currentUser.role === "Admin" && (
//                                 <>
//                                     <Nav.Link as={Link} to="/departments">Departments</Nav.Link>
//                                     <Nav.Link as={Link} to="/teachers">Teachers</Nav.Link>
//                                     <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
//                                     <Nav.Link as={Link} to="/subjects">Subjects</Nav.Link>
//                                     <Nav.Link as={Link} to="/students">Students</Nav.Link>
//                                     <Nav.Link as={Link} to="/enrollments">Enrollments</Nav.Link>
//                                     <Nav.Link as={Link} to="/attendances">Attendances</Nav.Link>
//                                 </>
//                             )}
//                             {currentUser && currentUser.role === "Teacher" && (
//                                 <>
//                                     <Nav.Link as={Link} to="/my-courses">My Courses</Nav.Link>
//                                     <Nav.Link as={Link} to="/my-students">My Students</Nav.Link>
//                                 </>
//                             )}
//                             {currentUser && currentUser.role === "Student" && (
//                                 <>
//                                     <Nav.Link as={Link} to="/my-enrollments">My Enrollments</Nav.Link>
//                                     <Nav.Link as={Link} to="/my-attendance">My Attendance</Nav.Link>
//                                 </>
//                             )}
//                         </Nav>
//                         <Nav>
//                             {currentUser ? (
//                                 <>
//                                     <Navbar.Text className="me-2">Signed in as: {currentUser.email} ({currentUser.role})</Navbar.Text>
//                                     <Nav.Link onClick={logout}>Logout</Nav.Link>
//                                 </>
//                             ) : (
//                                 <Nav.Link as={Link} to="/login">Login</Nav.Link>
//                             )}
//                         </Nav>
//                     </Navbar.Collapse>
//                 </Container>
//             </Navbar>

//             <Container className="mt-4">
//                 <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/register" element={<Register />} />
//                     <Route path="/unauthorized" element={<div>You are not authorized to view this page.</div>} />

//                     {/* Protected Routes for Admin */}
//                     <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
//                         <Route
//                             path="/departments"
//                             element={<DepartmentList
//                                 onAdd={() => navigate('/departments/add')}
//                                 onEdit={(d) => navigate(`/departments/edit/${d.departmentId}`, { state: { department: d } })}
//                                 onView={(d) => navigate(`/departments/view/${d.departmentId}`, { state: { department: d } })}
//                             />}
//                         />
//                         <Route path="/departments/add" element={<DepartmentForm onSaved={() => navigate('/departments')} onCancel={() => navigate('/departments')} />} />
//                         <Route path="/departments/edit/:id" element={<DepartmentForm onSaved={() => navigate('/departments')} onCancel={() => navigate('/departments')} />} />
//                         <Route
//                             path="/departments/view/:id"
//                             element={<DepartmentView
//                                 onBack={() => navigate('/departments')}
//                                 onEdit={(d) => navigate(`/departments/edit/${d.departmentId}`, { state: { department: d } })}
//                                 onDelete={async (id) => {
//                                     if (window.confirm("Are you sure you want to delete this department?")) {
//                                         try {
//                                             await deleteDepartment(id);
//                                             alert("Department deleted successfully.");
//                                             navigate('/departments');
//                                         } catch (err) {
//                                             alert("Failed to delete department.");
//                                             console.error(err);
//                                         }
//                                     }
//                                 }}
//                             />}
//                         />

//                         <Route
//                             path="/teachers"
//                             element={<TeacherList
//                                 onAdd={() => navigate('/teachers/add')}
//                                 onEdit={(t) => navigate(`/teachers/edit/${t.teacherId}`, { state: { teacher: t } })}
//                                 onView={(t) => navigate(`/teachers/view/${t.teacherId}`, { state: { teacher: t } })}
//                             />}
//                         />
//                         <Route path="/teachers/add" element={<TeacherForm onSaved={() => navigate('/teachers')} onClose={() => navigate('/teachers')} />} />
//                         <Route path="/teachers/edit/:id" element={<TeacherForm onSaved={() => navigate('/teachers')} onClose={() => navigate('/teachers')} />} />
//                         <Route
//                             path="/teachers/view/:id"
//                             element={<TeacherView
//                                 onBack={() => navigate('/teachers')}
//                                 onEdit={(t) => navigate(`/teachers/edit/${t.teacherId}`, { state: { teacher: t } })}
//                                 onDelete={async (id) => {
//                                     if (window.confirm("Are you sure you want to delete this teacher?")) {
//                                         try {
//                                             await deleteTeacher(id);
//                                             alert("Teacher deleted successfully.");
//                                             navigate('/teachers');
//                                         } catch (err) {
//                                             alert("Failed to delete teacher.");
//                                             console.error(err);
//                                         }
//                                     }
//                                 }}
//                             />}
//                         />

//                         {/* Courses Routes */}
//                         <Route 
//                             path="/courses" 
//                             element={<CourseList 
//                                 onAdd={() => navigate('/courses/add')} 
//                                 onEdit={(c) => navigate(`/courses/edit/${c.courseId}`, { state: { course: c } })}
//                                 onView={(c) => navigate(`/courses/view/${c.courseId}`, { state: { course: c } })} 
//                             />} 
//                         />
//                         <Route path="/courses/add" element={<CourseForm onSaved={() => navigate('/courses')} onCancel={() => navigate('/courses')} />} />
//                         <Route path="/courses/edit/:id" element={<CourseForm onSaved={() => navigate('/courses')} onCancel={() => navigate('/courses')} />} />
//                         <Route 
//                             path="/courses/view/:id" 
//                             element={<CourseView 
//                                 onBack={() => navigate('/courses')} 
//                                 onEdit={(c) => navigate(`/courses/edit/${c.courseId}`, { state: { course: c } })}
//                                 onDelete={async (id) => {
//                                     if (window.confirm("Are you sure you want to delete this course?")) {
//                                         try {
//                                             await deleteCourse(id);
//                                             alert("Course deleted successfully.");
//                                             navigate('/courses');
//                                         } catch (err) {
//                                             alert("Failed to delete course.");
//                                             console.error(err);
//                                         }
//                                     }
//                                 }}
//                             />} 
//                         />
                        
//                         {/* Subjects Routes */}
//                         <Route 
//                             path="/subjects" 
//                             element={<SubjectList 
//                                 onAdd={() => navigate('/subjects/add')} 
//                                 onEdit={(s) => navigate(`/subjects/edit/${s.subjectId}`, { state: { subject: s } })}
//                                 onView={(s) => navigate(`/subjects/view/${s.subjectId}`, { state: { subject: s } })} 
//                             />} 
//                         />
//                         <Route path="/subjects/add" element={<SubjectForm onSaved={() => navigate('/subjects')} onCancel={() => navigate('/subjects')} />} />
//                         <Route path="/subjects/edit/:id" element={<SubjectForm onSaved={() => navigate('/subjects')} onCancel={() => navigate('/subjects')} />} />
//                         <Route 
//                             path="/subjects/view/:id" 
//                             element={<SubjectView 
//                                 onBack={() => navigate('/subjects')} 
//                                 onEdit={(s) => navigate(`/subjects/edit/${s.subjectId}`, { state: { subject: s } })}
//                                 onDelete={async (id) => {
//                                     if (window.confirm("Are you sure you want to delete this subject?")) {
//                                         try {
//                                             await deleteSubject(id);
//                                             alert("Subject deleted successfully.");
//                                             navigate('/subjects');
//                                         } catch (err) {
//                                             alert("Failed to delete subject.");
//                                             console.error(err);
//                                         }
//                                     }
//                                 }}
//                             />} 
//                         />

//                         {/* Students Routes */}
//                         <Route
//                             path="/students"
//                             element={<StudentList
//                                 onAdd={() => navigate('/students/add')}
//                                 onEdit={(s) => navigate(`/students/edit/${s.studentId}`, { state: { student: s } })}
//                                 onView={(s) => navigate(`/students/view/${s.studentId}`, { state: { student: s } })}
//                             />}
//                         />
//                         <Route path="/students/add" element={<StudentForm onSaved={() => navigate('/students')} onCancel={() => navigate('/students')} />} />
//                         <Route path="/students/edit/:id" element={<StudentForm onSaved={() => navigate('/students')} onCancel={() => navigate('/students')} />} />
//                         <Route
//                             path="/students/view/:id"
//                             element={<StudentView
//                                 onBack={() => navigate('/students')}
//                                 onEdit={(s) => navigate(`/students/edit/${s.studentId}`, { state: { student: s } })}
//                                 onDelete={async (id) => {
//                                     if (window.confirm("Are you sure you want to delete this student?")) {
//                                         try {
//                                             await deleteStudent(id);
//                                             alert("Student deleted successfully.");
//                                             navigate('/students');
//                                         } catch (err) {
//                                             alert("Failed to delete student.");
//                                             console.error(err);
//                                         }
//                                     }
//                                 }}
//                             />}
//                         />

//                         {/* Enrollments Routes */}
//                         <Route
//                             path="/enrollments"
//                             element={<EnrollmentList
//                                 onAdd={() => navigate('/enrollments/add')}
//                                 onEdit={(e) => navigate(`/enrollments/edit/${e.enrollmentId}`, { state: { enrollment: e } })}
//                                 onView={(e) => navigate(`/enrollments/view/${e.enrollmentId}`, { state: { enrollment: e } })}
//                             />}
//                         />
//                         <Route path="/enrollments/add" element={<EnrollmentForm onSaved={() => navigate('/enrollments')} onCancel={() => navigate('/enrollments')} />} />
//                         <Route path="/enrollments/edit/:id" element={<EnrollmentForm onSaved={() => navigate('/enrollments')} onCancel={() => navigate('/enrollments')} />} />
//                         <Route
//                             path="/enrollments/view/:id"
//                             element={<EnrollmentView
//                                 onBack={() => navigate('/enrollments')}
//                                 onEdit={(e) => navigate(`/enrollments/edit/${e.enrollmentId}`, { state: { enrollment: e } })}
//                                 onDelete={async (id) => {
//                                     if (window.confirm("Are you sure you want to delete this enrollment?")) {
//                                         try {
//                                             await deleteEnrollment(id);
//                                             alert("Enrollment deleted successfully.");
//                                             navigate('/enrollments');
//                                         } catch (err) {
//                                             alert("Failed to delete enrollment.");
//                                             console.error(err);
//                                         }
//                                     }
//                                 }}
//                             />}
//                         />

//                         {/* Attendances Routes */}
//                         <Route
//                             path="/attendances"
//                             element={<AttendanceList
//                                 onAdd={() => navigate('/attendances/add')}
//                                 onEdit={(a) => navigate(`/attendances/edit/${a.attendanceId}`, { state: { attendance: a } })}
//                                 onView={(a) => navigate(`/attendances/view/${a.attendanceId}`, { state: { attendance: a } })}
//                             />}
//                         />
//                         <Route path="/attendances/add" element={<AttendanceForm onSaved={() => navigate('/attendances')} onCancel={() => navigate('/attendances')} />} />
//                         <Route path="/attendances/edit/:id" element={<AttendanceForm onSaved={() => navigate('/attendances')} onCancel={() => navigate('/attendances')} />} />
//                         <Route
//                             path="/attendances/view/:id"
//                             element={<AttendanceView
//                                 onBack={() => navigate('/attendances')}
//                                 onEdit={(a) => navigate(`/attendances/edit/${a.attendanceId}`, { state: { attendance: a } })}
//                                 onDelete={async (id) => {
//                                     if (window.confirm("Are you sure you want to delete this attendance?")) {
//                                         try {
//                                             await deleteAttendance(id);
//                                             alert("Attendance deleted successfully.");
//                                             navigate('/attendances');
//                                         } catch (err) {
//                                             alert("Failed to delete attendance.");
//                                             console.error(err);
//                                         }
//                                     }
//                                 }}
//                             />}
//                         />

//                     </Route>

//                     {/* Protected Routes for Teacher */}
//                     <Route element={<PrivateRoute allowedRoles={['Teacher']} />}>
//                         <Route path="/my-courses" element={<div>Teacher's Courses</div>} />
//                         <Route path="/my-students" element={<div>Teacher's Students</div>} />
//                     </Route>

//                     {/* Protected Routes for Student */}
//                     <Route element={<PrivateRoute allowedRoles={['Student']} />}>
//                         <Route path="/my-enrollments" element={<div>Student's Enrollments</div>} />
//                         <Route path="/my-attendance" element={<div>Student's Attendance</div>} />
//                     </Route>

//                     {/* Fallback route for 404 Not Found */}
//                     <Route path="*" element={<div>404 Page Not Found</div>} />
//                 </Routes>
//             </Container>
//         </>
//     );
// };

// function App() {
//     return (
//         <BrowserRouter>
//             <AppContent />
//         </BrowserRouter>
//     );
// }

// export default App;

import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import AuthContext from './context/AuthProvider';
import PrivateRoute from './routes/PrivateRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// All Components
import Home from './pages/Home';
import DepartmentList from './components/Department/DepartmentList';
import DepartmentForm from './components/Department/DepartmentForm';
import DepartmentView from './components/Department/DepartmentView';
import TeacherList from './components/Teacher/TeacherList';
import TeacherForm from './components/Teacher/TeacherForm';
import TeacherView from './components/Teacher/TeacherView';
import CourseList from './components/Course/CourseList';
import CourseForm from './components/Course/CourseForm';
import CourseView from './components/Course/CourseView';
import SubjectList from './components/Subject/SubjectList';
import SubjectForm from './components/Subject/SubjectForm';
import SubjectView from './components/Subject/SubjectView';
import StudentList from './components/Student/StudentList';
import StudentForm from './components/Student/StudentForm';
import StudentView from './components/Student/StudentView';
import EnrollmentList from './components/Enrollment/EnrollmentList';
import EnrollmentForm from './components/Enrollment/EnrollmentForm';
import EnrollmentView from './components/Enrollment/EnrollmentView';
import AttendanceList from './components/Attendance/AttendanceList';
import AttendanceForm from './components/Attendance/AttendanceForm';
import AttendanceView from './components/Attendance/AttendanceView';

// Service functions
import { deleteDepartment } from './services/departmentService';
import { deleteTeacher } from './services/teacherService';
import { deleteCourse } from './services/courseService';
import { deleteSubject } from './services/subjectService';
import { deleteStudent } from './services/studentService';
import { deleteEnrollment } from './services/enrollmentService';
import { deleteAttendance } from './services/attendanceService';

import './App.css';

const AppContent = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Education System</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {currentUser && currentUser.role === "Admin" && (
                <>
                  <Nav.Link as={Link} to="/departments">Departments</Nav.Link>
                  <Nav.Link as={Link} to="/teachers">Teachers</Nav.Link>
                  <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
                  <Nav.Link as={Link} to="/subjects">Subjects</Nav.Link>
                  <Nav.Link as={Link} to="/students">Students</Nav.Link>
                  <Nav.Link as={Link} to="/enrollments">Enrollments</Nav.Link>
                  <Nav.Link as={Link} to="/attendances">Attendances</Nav.Link>
                </>
              )}
              {currentUser && currentUser.role === "Teacher" && (
                <>
                  <Nav.Link as={Link} to="/courses">My Courses</Nav.Link>
                  <Nav.Link as={Link} to="/students">My Students</Nav.Link>
                </>
              )}
              {currentUser && currentUser.role === "Student" && (
                <>
                  <Nav.Link as={Link} to="/enrollments">My Enrollments</Nav.Link>
                  <Nav.Link as={Link} to="/attendance">My Attendance</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              {currentUser ? (
                <>
                  <Navbar.Text className="me-2">Signed in as: {currentUser.email} ({currentUser.role})</Navbar.Text>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<div>You are not authorized to view this page.</div>} />

         
          <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
            <Route
              path="/departments"
              element={<DepartmentList
                onAdd={() => navigate('/departments/add')}
                onEdit={(d) => navigate(`/departments/edit/${d.departmentId}`, { state: { department: d } })}
                onView={(d) => navigate(`/departments/view/${d.departmentId}`, { state: { department: d } })}
              />}
            />
            <Route path="/departments/add" element={<DepartmentForm onSaved={() => navigate('/departments')} onCancel={() => navigate('/departments')} />} />
            <Route path="/departments/edit/:id" element={<DepartmentForm onSaved={() => navigate('/departments')} onCancel={() => navigate('/departments')} />} />
            <Route
              path="/departments/view/:id"
              element={<DepartmentView
                onBack={() => navigate('/departments')}
                onEdit={(d) => navigate(`/departments/edit/${d.departmentId}`, { state: { department: d } })}
                onDelete={async (id) => {
                  if (window.confirm("Are you sure you want to delete this department?")) {
                    try {
                      await deleteDepartment(id);
                      alert("Department deleted successfully.");
                      navigate('/departments');
                    } catch (err) {
                      alert("Failed to delete department.");
                      console.error(err);
                    }
                  }
                }}
              />}
            />

            <Route
              path="/teachers"
              element={<TeacherList
                onAdd={() => navigate('/teachers/add')}
                onEdit={(t) => navigate(`/teachers/edit/${t.teacherId}`, { state: { teacher: t } })}
                onView={(t) => navigate(`/teachers/view/${t.teacherId}`, { state: { teacher: t } })}
              />}
            />
            <Route path="/teachers/add" element={<TeacherForm onSaved={() => navigate('/teachers')} onClose={() => navigate('/teachers')} />} />
            <Route path="/teachers/edit/:id" element={<TeacherForm onSaved={() => navigate('/teachers')} onClose={() => navigate('/teachers')} />} />
            <Route
              path="/teachers/view/:id"
              element={<TeacherView
                onBack={() => navigate('/teachers')}
                onEdit={(t) => navigate(`/teachers/edit/${t.teacherId}`, { state: { teacher: t } })}
                onDelete={async (id) => {
                  if (window.confirm("Are you sure you want to delete this teacher?")) {
                    try {
                      await deleteTeacher(id);
                      alert("Teacher deleted successfully.");
                      navigate('/teachers');
                    } catch (err) {
                      alert("Failed to delete teacher.");
                      console.error(err);
                    }
                  }
                }}
              />}
            />

            <Route
              path="/courses"
              element={<CourseList
                onAdd={() => navigate('/courses/add')}
                onEdit={(c) => navigate(`/courses/edit/${c.courseId}`, { state: { course: c } })}
                onView={(c) => navigate(`/courses/view/${c.courseId}`, { state: { course: c } })}
              />}
            />
            <Route path="/courses/add" element={<CourseForm onSaved={() => navigate('/courses')} onCancel={() => navigate('/courses')} />} />
            <Route path="/courses/edit/:id" element={<CourseForm onSaved={() => navigate('/courses')} onCancel={() => navigate('/courses')} />} />
            <Route
              path="/courses/view/:id"
              element={<CourseView
                onBack={() => navigate('/courses')}
                onEdit={(c) => navigate(`/courses/edit/${c.courseId}`, { state: { course: c } })}
                onDelete={async (id) => {
                  if (window.confirm("Are you sure you want to delete this course?")) {
                    try {
                      await deleteCourse(id);
                      alert("Course deleted successfully.");
                      navigate('/courses');
                    } catch (err) {
                      alert("Failed to delete course.");
                      console.error(err);
                    }
                  }
                }}
              />}
            />

            <Route
              path="/subjects"
              element={<SubjectList
                onAdd={() => navigate('/subjects/add')}
                onEdit={(s) => navigate(`/subjects/edit/${s.subjectId}`, { state: { subject: s } })}
                onView={(s) => navigate(`/subjects/view/${s.subjectId}`, { state: { subject: s } })}
              />}
            />
            <Route path="/subjects/add" element={<SubjectForm onSaved={() => navigate('/subjects')} onCancel={() => navigate('/subjects')} />} />
            <Route path="/subjects/edit/:id" element={<SubjectForm onSaved={() => navigate('/subjects')} onCancel={() => navigate('/subjects')} />} />
            <Route
              path="/subjects/view/:id"
              element={<SubjectView
                onBack={() => navigate('/subjects')}
                onEdit={(s) => navigate(`/subjects/edit/${s.subjectId}`, { state: { subject: s } })}
                onDelete={async (id) => {
                  if (window.confirm("Are you sure you want to delete this subject?")) {
                    try {
                      await deleteSubject(id);
                      alert("Subject deleted successfully.");
                      navigate('/subjects');
                    } catch (err) {
                      alert("Failed to delete subject.");
                      console.error(err);
                    }
                  }
                }}
              />}
            />

            <Route
              path="/students"
              element={<StudentList
                onAdd={() => navigate('/students/add')}
                onEdit={(s) => navigate(`/students/edit/${s.studentId}`, { state: { student: s } })}
                onView={(s) => navigate(`/students/view/${s.studentId}`, { state: { student: s } })}
              />}
            />
            <Route path="/students/add" element={<StudentForm onSaved={() => navigate('/students')} onCancel={() => navigate('/students')} />} />
            <Route path="/students/edit/:id" element={<StudentForm onSaved={() => navigate('/students')} onCancel={() => navigate('/students')} />} />
            <Route
              path="/students/view/:id"
              element={<StudentView
                onBack={() => navigate('/students')}
                onEdit={(s) => navigate(`/students/edit/${s.studentId}`, { state: { student: s } })}
                onDelete={async (id) => {
                  if (window.confirm("Are you sure you want to delete this student?")) {
                    try {
                      await deleteStudent(id);
                      alert("Student deleted successfully.");
                      navigate('/students');
                    } catch (err) {
                      alert("Failed to delete student.");
                      console.error(err);
                    }
                  }
                }}
              />}
            />

            <Route
              path="/enrollments"
              element={<EnrollmentList
                onAdd={() => navigate('/enrollments/add')}
                onEdit={(e) => navigate(`/enrollments/edit/${e.enrollmentId}`, { state: { enrollment: e } })}
                onView={(e) => navigate(`/enrollments/view/${e.enrollmentId}`, { state: { enrollment: e } })}
              />}
            />
            <Route path="/enrollments/add" element={<EnrollmentForm onSaved={() => navigate('/enrollments')} onCancel={() => navigate('/enrollments')} />} />
            <Route path="/enrollments/edit/:id" element={<EnrollmentForm onSaved={() => navigate('/enrollments')} onCancel={() => navigate('/enrollments')} />} />
            <Route
              path="/enrollments/view/:id"
              element={<EnrollmentView
                onBack={() => navigate('/enrollments')}
                onEdit={(e) => navigate(`/enrollments/edit/${e.enrollmentId}`, { state: { enrollment: e } })}
                onDelete={async (id) => {
                  if (window.confirm("Are you sure you want to delete this enrollment?")) {
                    try {
                      await deleteEnrollment(id);
                      alert("Enrollment deleted successfully.");
                      navigate('/enrollments');
                    } catch (err) {
                      alert("Failed to delete enrollment.");
                      console.error(err);
                    }
                  }
                }}
              />}
            />

            <Route
              path="/attendances"
              element={<AttendanceList
                onAdd={() => navigate('/attendances/add')}
                onEdit={(a) => navigate(`/attendances/edit/${a.attendanceId}`, { state: { attendance: a } })}
                onView={(a) => navigate(`/attendances/view/${a.attendanceId}`, { state: { attendance: a } })}
              />}
            />
            <Route path="/attendances/add" element={<AttendanceForm onSaved={() => navigate('/attendances')} onCancel={() => navigate('/attendances')} />} />
            <Route path="/attendances/edit/:id" element={<AttendanceForm onSaved={() => navigate('/attendances')} onCancel={() => navigate('/attendances')} />} />
            <Route
              path="/attendances/view/:id"
              element={<AttendanceView
                onBack={() => navigate('/attendances')}
                onEdit={(a) => navigate(`/attendances/edit/${a.attendanceId}`, { state: { attendance: a } })}
                onDelete={async (id) => {
                  if (window.confirm("Are you sure you want to delete this attendance?")) {
                    try {
                      await deleteAttendance(id);
                      alert("Attendance deleted successfully.");
                      navigate('/attendances');
                    } catch (err) {
                      alert("Failed to delete attendance.");
                      console.error(err);
                    }
                  }
                }}
              />}
            />

          </Route>

          
          <Route element={<PrivateRoute allowedRoles={['Admin', 'Teacher']} />}>
            
            <Route path="/my-courses" element={<div>Teacher's Courses</div>} />
            <Route path="/my-students" element={<div>Teacher's Students</div>} />
            
          </Route>

         
          <Route element={<PrivateRoute allowedRoles={['Admin', 'Student']} />}>
            
            <Route path="/my-enrollments" element={<div>Student's Enrollments</div>} />
            <Route path="/my-attendance" element={<div>Student's Attendance</div>} />
          
          </Route>

         
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </Container>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;