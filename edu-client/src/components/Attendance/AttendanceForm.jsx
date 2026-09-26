import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getStudents } from "../../services/studentService";
import { getCourses } from "../../services/courseService";
import { createAttendance, updateAttendance } from "../../services/attendanceService";

function AttendanceForm({ onSaved, onCancel }) {
  const { id } = useParams();
  const location = useLocation();
  const attendanceFromState = location.state?.attendance;

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    attendanceDate: "",
    isPresent: false,
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

    if (attendanceFromState) {
      setFormData({
        studentId: String(attendanceFromState.studentId),
        courseId: String(attendanceFromState.courseId),
        attendanceDate: attendanceFromState.attendanceDate?.split("T")[0] || "",
        isPresent: attendanceFromState.isPresent || false,
      });
    } else {
      setFormData({
        studentId: "",
        courseId: "",
        attendanceDate: "",
        isPresent: false,
      });
    }
  }, [attendanceFromState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const studentId = parseInt(formData.studentId);
    const courseId = parseInt(formData.courseId);

    
    if (isNaN(studentId) || isNaN(courseId) || !formData.attendanceDate) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      attendanceId: id ? parseInt(id) : 0, 
      studentId: studentId,
      courseId: courseId,
      attendanceDate: formData.attendanceDate, 
    };

    try {
      if (id) {
        await updateAttendance(id, dataToSend);
      } else {
        await createAttendance(dataToSend);
      }
      onSaved();
    } catch (err) {
      console.error("API call error:", err.response?.data || err.message);
      setError("Failed to save attendance. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{id ? "Edit" : "Add"} Attendance</h2>
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
            <label htmlFor="attendanceDate" className="form-label">Date</label>
            <input
              type="date"
              id="attendanceDate"
              name="attendanceDate"
              className="form-control"
              value={formData.attendanceDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              id="isPresent"
              name="isPresent"
              className="form-check-input"
              checked={formData.isPresent}
              onChange={handleChange}
            />
            <label htmlFor="isPresent" className="form-check-label">Present</label>
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

export default AttendanceForm;