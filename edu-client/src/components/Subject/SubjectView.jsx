import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Alert, Spinner, ButtonGroup } from "react-bootstrap";
import { BsArrowLeft, BsPencil, BsTrash } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { getSubjectById } from "../../services/subjectService";

const SubjectView = ({ onBack, onEdit, onDelete }) => {
  const location = useLocation();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSubjectData = async () => {
      setLoading(true);
      setError(null);

     
      if (location.state && location.state.subject) {
        setSubject(location.state.subject);
        setLoading(false);
      } else {
        
        const id = location.pathname.split('/').pop();
        if (id) {
          try {
            const res = await getSubjectById(id);
            setSubject(res.data);
          } catch (err) { 
            console.error("Failed to load subject data:", err); 
            setError("Failed to load subject data.");
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
          setError("No subject ID provided.");
        }
      }
    };
    loadSubjectData();
  }, [location]);

  if (loading) {
    return <div className="text-center mt-4"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="text-center mt-4">{error}</Alert>;
  }

  if (!subject) {
    return <Alert variant="info" className="text-center mt-4">No subject data available.</Alert>;
  }

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: "100%", maxWidth: "500px", background: "#eef2f7" }} className="mt-4 shadow">
        <Card.Header className="bg-info text-white text-center fs-5">Subject Information</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col xs={5}><strong>ID:</strong></Col>
            <Col>{subject.subjectId}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={5}><strong>Subject Name:</strong></Col>
            <Col>{subject.subjectName}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={5}><strong>Course:</strong></Col>
            <Col>{subject.courseName}</Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-center">
          <ButtonGroup>
            <Button variant="secondary" onClick={onBack} className="me-2">
              <BsArrowLeft /> Back
            </Button>
            <Button variant="warning" onClick={() => onEdit(subject)} className="me-2">
              <BsPencil /> Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(subject.subjectId)}>
              <BsTrash /> Delete
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SubjectView;