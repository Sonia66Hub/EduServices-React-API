// src/components/Enrollment/EnrollmentForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getStudents } from "../../services/studentService";
import { getCourses } from "../../services/courseService";
import { createEnrollment, updateEnrollment } from "../../services/enrollmentService";

function EnrollmentForm({ onSaved, onCancel }) {
  const { id } = useParams();
  const location = useLocation();
  const enrollmentFromState = location.state?.enrollment;

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    enrollmentDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          getStudents(),
          getCourses(),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (e) {
        console.error("Failed to load students or courses:", e);
        setError("Failed to load students or courses");
      }
    }
    loadData();

    if (enrollmentFromState) {
      setFormData({
        studentId: String(enrollmentFromState.studentId),
        courseId: String(enrollmentFromState.courseId),
        enrollmentDate: enrollmentFromState.enrollmentDate?.split("T")[0] || "",
      });
    } else {
      
      setFormData({
        studentId: "",
        courseId: "",
        enrollmentDate: new Date().toISOString().split('T')[0], 
      });
    }
  }, [enrollmentFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const studentId = parseInt(formData.studentId);
    const courseId = parseInt(formData.courseId);

    if (isNaN(studentId) || isNaN(courseId) || !formData.enrollmentDate) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      enrollmentId: id ? parseInt(id) : 0, 
      studentId: studentId,
      courseId: courseId,
      enrollmentDate: formData.enrollmentDate, 
    };

    try {
      if (id) {
        await updateEnrollment(id, dataToSend);
      } else {
        await createEnrollment(dataToSend);
      }
      onSaved();
    } catch (err) {
      console.error("API call error:", err.response?.data || err.message);
      setError("Failed to save enrollment. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{id ? "Edit" : "Add"} Enrollment</h2>
      {error && <p className="text-danger">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="studentId" className="form-label">Student</label>
            <select
              id="studentId"
              name="studentId"
              className="form-select"
              value={formData.studentId}
              onChange={handleChange}
              required
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>{s.fullName}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="courseId" className="form-label">Course</label>
            <select
              id="courseId"
              name="courseId"
              className="form-select"
              value={formData.courseId}
              onChange={handleChange}
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="enrollmentDate" className="form-label">Enrollment Date</label>
            <input
              type="date"
              id="enrollmentDate"
              name="enrollmentDate"
              className="form-control"
              value={formData.enrollmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary me-2" disabled={loading}>
            {id ? "Update" : "Save"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default EnrollmentForm;