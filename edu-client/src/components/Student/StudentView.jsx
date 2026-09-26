import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Table, Image, Container, Row, Col, ButtonGroup } from "react-bootstrap";
import { BsArrowLeft, BsPencil, BsTrash } from "react-icons/bs";
import { getStudentById } from "../../services/studentService";

const StudentView = ({ onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(location.state?.student || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await getStudentById(id);
        setStudent(res.data);
      } catch (err) {
        console.error("Failed to fetch student details:", err);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.student) {
      setStudent(location.state.student);
      setLoading(false);
    } else if (id) {
      fetchStudent();
    } else {
      setError("Student ID not found in URL or state.");
      setLoading(false);
    }
  }, [id, location.state]);

  const handleBackClick = () => {
    navigate("/students");
  };

  const handleEditClick = () => {
    navigate(`/students/edit/${student.studentId}`, { state: { student: student } });
  };

  const handleDeleteClick = async () => {
    if (onDelete && student?.studentId) {
      await onDelete(student.studentId);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading student data...</p>;
  if (error) return <div className="alert alert-danger text-center mt-4">{error}</div>;
  if (!student) return <p className="text-center mt-4">No student data available.</p>;

  const formattedDateOfBirth = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A";

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: "100%", maxWidth: "600px" }} className="mt-4 shadow">
        <Card.Header className="bg-primary text-white text-center fs-5">
          Student Information
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-center mb-4">
            {student.picture ? (
              <Image
                src={student.picture}
                roundedCircle
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                alt="Student Photo"
              />
            ) : (
              <div
                style={{
                  width: "150px", height: "150px", backgroundColor: "#ccc",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "12px", textAlign: "center"
                }}>
                No Photo Available
              </div>
            )}
          </div>
          <Table striped bordered hover responsive>
            <tbody>
              <tr>
                <th>Full Name</th>
                <td>{student.fullName}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{student.email}</td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>{formattedDateOfBirth}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="text-center">
          <ButtonGroup>
            <Button variant="secondary" onClick={handleBackClick}>
              <BsArrowLeft className="me-1" /> Back
            </Button>
            <Button variant="warning" onClick={handleEditClick}>
              <BsPencil className="me-1" /> Edit
            </Button>
            <Button variant="danger" onClick={handleDeleteClick}>
              <BsTrash className="me-1" /> Delete
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default StudentView;