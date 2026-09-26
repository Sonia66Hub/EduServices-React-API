import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, Button, Container, Row, Col, ButtonGroup, Alert } from "react-bootstrap";
import { BsArrowLeft, BsFileEarmark, BsTrash, BsPencil } from "react-icons/bs";
import { getEnrollmentById } from "../../services/enrollmentService";

const EnrollmentView = ({ onBack, onEdit, onDelete }) => {
  const { id } = useParams();
  const location = useLocation();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  
    if (location.state && location.state.enrollment) {
      setEnrollment(location.state.enrollment);
      setLoading(false);
    } else {
      
      const fetchEnrollment = async () => {
        try {
          if (id) {
            const res = await getEnrollmentById(id);
            setEnrollment(res.data);
          } else {
            setError("Enrollment ID not found in URL.");
          }
        } catch (err) {
          console.error("Failed to fetch enrollment:", err);
          setError("Failed to load enrollment data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchEnrollment();
    }
  }, [id, location]);

  if (loading) {
    return <p className="text-center mt-4">Loading enrollment data...</p>;
  }

  if (error) {
    return <Alert variant="danger" className="text-center mt-4">{error}</Alert>;
  }

  if (!enrollment) {
    return <p className="text-center mt-4">No enrollment data available.</p>;
  }

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: "100%", maxWidth: "500px", background: "#f8f9fa" }} className="mt-4 shadow">
        <Card.Header className="bg-primary text-white text-center fs-5">
          <BsFileEarmark className="me-2" />
          Enrollment Information
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col xs={4}><strong>ID:</strong></Col>
            <Col>{enrollment.enrollmentId}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4}><strong>Student:</strong></Col>
            <Col>{enrollment.studentName}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4}><strong>Course:</strong></Col>
            <Col>{enrollment.courseName}</Col>
          </Row>
          <Row>
            <Col xs={4}><strong>Enrollment Date:</strong></Col>
            <Col>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-center">
          <ButtonGroup>
            <Button variant="secondary" onClick={onBack}>
              <BsArrowLeft className="me-1" /> Back to List
            </Button>
            <Button variant="warning" onClick={() => onEdit(enrollment)}>
              <BsPencil className="me-1" /> Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(enrollment.enrollmentId)}>
              <BsTrash className="me-1" /> Delete
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default EnrollmentView;