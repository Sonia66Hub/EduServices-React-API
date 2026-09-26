import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
import { BsArrowLeft, BsPencilSquare, BsTrash, BsCalendarCheck } from "react-icons/bs";

const AttendanceView = ({ onBack, onEdit, onDelete }) => {
  const location = useLocation();
  const [attendance, setAttendance] = useState(location.state?.attendance);

  useEffect(() => {
    if (location.state?.attendance) {
      setAttendance(location.state.attendance);
    }
  }, [location.state]);

  if (!attendance) {
    return (
      <Container className="text-center mt-5">
        <p>No attendance data available.</p>
        <Button variant="primary" onClick={onBack}>
          <BsArrowLeft className="me-1" /> Back to List
        </Button>
      </Container>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card
        style={{ width: "100%", maxWidth: "600px", background: "#f8f9fa" }}
        className="mt-4 shadow"
      >
        <Card.Header className="bg-success text-white text-center fs-5">
          <BsCalendarCheck className="me-2" />
          Attendance Information
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col xs={5}><strong>ID:</strong></Col>
            <Col>{attendance.attendanceId}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={5}><strong>Student Name:</strong></Col>
            <Col>{attendance.studentName}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={5}><strong>Course Name:</strong></Col>
            <Col>{attendance.courseName}</Col>
          </Row>
          <Row className="mb-3">
            <Col xs={5}><strong>Date:</strong></Col>
            <Col>{formatDate(attendance.attendanceDate)}</Col>
          </Row>
          <Row>
            <Col xs={5}><strong>Status:</strong></Col>
            <Col>
              <Badge bg={attendance.isPresent ? "success" : "danger"}>
                {attendance.isPresent ? "Present" : "Absent"}
              </Badge>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-center d-flex justify-content-center gap-2 flex-wrap">
          <Button variant="secondary" onClick={onBack}>
            <BsArrowLeft className="me-1" />
            Back to List
          </Button>
          <Button variant="warning" onClick={() => onEdit(attendance)}>
            <BsPencilSquare className="me-1" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(attendance.attendanceId)}>
            <BsTrash className="me-1" />
            Delete
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default AttendanceView;