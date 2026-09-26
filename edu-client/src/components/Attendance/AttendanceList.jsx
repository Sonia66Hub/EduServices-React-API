import React, { useEffect, useState } from "react";
import { getAttendances, deleteAttendance } from "../../services/attendanceService";

function AttendanceList({ onAdd, onEdit, onView }) {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 

  const loadAttendances = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAttendances();
      setAttendances(res.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load attendances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendances();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
    try {
      await deleteAttendance(id);
      loadAttendances();
    } catch (e) {
      console.error(e);
      alert("Failed to delete attendance.");
    }
  };

  
  const filteredAttendances = attendances.filter(a =>
    a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading attendance records...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2 className="mb-3">Attendance Records</h2>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={onAdd}>
          Add Attendance
        </button>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by student or course name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Course Name</th>
            <th>Date</th>
            <th>Present</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendances.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No attendance records found.</td>
            </tr>
          ) : (
            filteredAttendances.map((a) => (
              <tr key={a.attendanceId}>
                <td>{a.attendanceId}</td>
                <td>{a.studentName}</td>
                <td>{a.courseName}</td>
                <td>{new Date(a.attendanceDate).toLocaleDateString()}</td>
                <td>{a.isPresent ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => onView(a)}
                  >
                    View
                  </button>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(a)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.attendanceId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceList;