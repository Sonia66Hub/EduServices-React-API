import React, { useEffect, useState } from "react";
import { getCourses, deleteCourse } from "../../services/courseService";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { BsPencil, BsTrash, BsEye } from "react-icons/bs";

function CourseList({ onAdd, onEdit, onView }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await getCourses();
      setCourses(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await deleteCourse(id);
        loadCourses();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Delete failed.");
      }
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);


  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-3">Courses</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button onClick={onAdd}>
          Add Course
        </Button>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by course name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">No courses found.</td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course.courseId}>
                  <td>{course.courseId}</td>
                  <td>{course.courseName}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => onView(course)}
                      className="me-2"
                    >
                      <BsEye /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => onEdit(course)}
                      className="me-2"
                    >
                      <BsPencil /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(course.courseId)}
                    >
                      <BsTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default CourseList;