import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, ButtonGroup, Alert, Spinner } from "react-bootstrap";
import { BsArrowLeft, BsPencil, BsTrash, BsPerson } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { getTeacher } from "../../services/teacherService";

const TeacherView = ({ onBack, onEdit, onDelete }) => {
  const location = useLocation();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state && location.state.teacher) {
      setTeacher(location.state.teacher);
      setLoading(false);
    } else {
      const fetchTeacher = async () => {
        const id = location.pathname.split('/').pop();
        if (id) {
          try {
            const res = await getTeacher(id);
            setTeacher(res.data);
            setError(null);
          } catch (err) {
            console.error("Failed to fetch teacher:", err);
            setError("Failed to load teacher data. Please try again.");
          } finally {
            setLoading(false);
          }
        }
      };
      fetchTeacher();
    }
  }, [location]);

  const getImageUrl = (picturePath) => {
    if (!picturePath) return "";
    return picturePath.startsWith("http") ? picturePath : `https://localhost:5088/${picturePath.replace(/\\/g, '/')}`;
  };

  if (loading) {
    return <p className="text-center mt-4"><Spinner animation="border" /> Loading teacher data...</p>;
  }

  if (error) {
    return <Alert variant="danger" className="text-center mt-4">{error}</Alert>;
  }

  if (!teacher) {
    return <p className="text-center mt-4">No teacher data available.</p>;
  }

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: "100%", maxWidth: "500px", background: "#eef2f7" }} className="mt-4 shadow">
        <Card.Header className="bg-info text-white text-center fs-5">
          <BsPerson className="me-2" />
          Teacher Information
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col xs={4}><strong>ID:</strong></Col>
            <Col>{teacher.teacherId}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4}><strong>Name:</strong></Col>
            <Col>{teacher.name}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4}><strong>Department:</strong></Col>
            <Col>{teacher.departmentName}</Col>
          </Row>
          {teacher.picture && (
            <Row className="mb-3">
              <Col xs={4}><strong>Photo:</strong></Col>
              <Col>
                <img
                  src={getImageUrl(teacher.picture)}
                  alt={teacher.name}
                  className="img-fluid rounded"
                  style={{ maxWidth: "150px" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.png";
                  }}
                />
              </Col>
            </Row>
          )}
        </Card.Body>
        <Card.Footer className="text-center">
          <ButtonGroup>
            <Button variant="secondary" onClick={onBack} className="me-2">
              <BsArrowLeft /> Back
            </Button>
            <Button variant="warning" onClick={() => onEdit(teacher)} className="me-2">
              <BsPencil /> Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(teacher.teacherId)}>
              <BsTrash /> Delete
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default TeacherView;