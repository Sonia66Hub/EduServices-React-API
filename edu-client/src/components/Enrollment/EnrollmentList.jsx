import React, { useEffect, useState } from "react";
import { getEnrollments, deleteEnrollment } from "../../services/enrollmentService";
import { useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";

function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchEnrollments = async () => {
    try {
      const response = await getEnrollments();
      setEnrollments(response.data);
      setLoading(false);
    } catch {
      setError("Failed to fetch enrollments. Please check your connection or try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleEdit = (enrollment) => {
    navigate(`/enrollments/edit/${enrollment.enrollmentId}`, { state: { enrollment } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      try {
        await deleteEnrollment(id);
        setEnrollments(enrollments.filter((e) => e.enrollmentId !== id));
      } catch {
        setError("Failed to delete enrollment.");
      }
    }
  };

  const handleView = (enrollment) => {
    navigate(`/enrollments/view/${enrollment.enrollmentId}`, { state: { enrollment } });
  };

  const handleAdd = () => {
    navigate("/enrollments/add");
  };

  const filteredEnrollments = enrollments.filter(e =>
    e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        
        <div>
          <h2>Enrollments</h2>
          <Button variant="primary" onClick={handleAdd} className="mt-2">
            <FaPlus className="me-2" /> Add Enrollment
          </Button>
        </div>
        
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            style={{ width: "200px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Course Name</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEnrollments.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No enrollments found.</td>
            </tr>
          ) : (
            filteredEnrollments.map((enrollment) => (
              <tr key={enrollment.enrollmentId}>
                <td>{enrollment.enrollmentId}</td>
                <td>{enrollment.studentName}</td>
                <td>{enrollment.courseName}</td>
                <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleView(enrollment)}>
                    <FaEye />
                  </Button>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(enrollment)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(enrollment.enrollmentId)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default EnrollmentList;