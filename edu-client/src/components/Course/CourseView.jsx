import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Alert, Spinner, ButtonGroup } from "react-bootstrap";
import { BsArrowLeft, BsPencil, BsTrash } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { getCourseById } from "../../services/courseService";

const CourseView = ({ onBack, onEdit, onDelete }) => {
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      setError(null);

      if (location.state && location.state.course) {
        setCourse(location.state.course);
        setLoading(false);
      } else {
        const id = location.pathname.split('/').pop();
        if (id) {
          try {
            const res = await getCourseById(id);
            setCourse(res.data);
          } catch (err) {
            console.error("Failed to load course data:", err);
            setError("Failed to load course data.");
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
          setError("No course ID provided.");
        }
      }
    };
    loadCourseData();
  }, [location]);

  if (loading) {
    return <div className="text-center mt-4"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="text-center mt-4">{error}</Alert>;
  }

  if (!course) {
    return <Alert variant="info" className="text-center mt-4">No course data available.</Alert>;
  }

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: "100%", maxWidth: "500px", background: "#eef2f7" }} className="mt-4 shadow">
        <Card.Header className="bg-info text-white text-center fs-5">Course Information</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col xs={5}><strong>ID:</strong></Col>
            <Col>{course.courseId}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={5}><strong>Course Name:</strong></Col>
            <Col>{course.courseName}</Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-center">
          <ButtonGroup>
            <Button variant="secondary" onClick={onBack} className="me-2">
              <BsArrowLeft /> Back
            </Button>
            <Button variant="warning" onClick={() => onEdit(course)} className="me-2">
              <BsPencil /> Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(course.courseId)}>
              <BsTrash /> Delete
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default CourseView;