import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import { Card, Button, Container, Row, Col, ButtonGroup } from "react-bootstrap";
import { BsArrowLeft, BsBuilding, BsTrash, BsPencil } from "react-icons/bs";
import { getDepartmentById } from "../../services/departmentService"; 

const DepartmentView = ({ onBack, onEdit, onDelete }) => {
  const location = useLocation();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    if (location.state && location.state.department) {
      setDepartment(location.state.department);
      setLoading(false);
    } else {
      
      const fetchDepartment = async () => {
        try {
          const id = location.pathname.split('/').pop();
          if (id) {
            const res = await getDepartmentById(id);
            setDepartment(res.data);
          } else {
            setError("Department ID not found in URL.");
          }
        } catch (err) {
          console.error("Failed to fetch department:", err);
          setError("Failed to load department data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchDepartment();
    }
  }, [location]);

  if (loading) {
    return <p className="text-center mt-4">Loading department data...</p>;
  }

  if (error) {
    return <Alert variant="danger" className="text-center mt-4">{error}</Alert>;
  }

  if (!department) {
    return <p className="text-center mt-4">No department data available.</p>;
  }

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: "100%", maxWidth: "500px", background: "#f8f9fa" }} className="mt-4 shadow">
        <Card.Header className="bg-primary text-white text-center fs-5">
          <BsBuilding className="me-2" />
          Department Information
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col xs={4}><strong>ID:</strong></Col>
            <Col>{department.departmentId}</Col>
          </Row>
          <Row>
            <Col xs={4}><strong>Name:</strong></Col>
            <Col>{department.departmentName}</Col> 
          </Row>
        </Card.Body>
        <Card.Footer className="text-center">
          <ButtonGroup>
            <Button variant="secondary" onClick={onBack}>
              <BsArrowLeft className="me-1" /> Back
            </Button>
            <Button variant="warning" onClick={() => onEdit(department)}>
              <BsPencil className="me-1" /> Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(department.departmentId)}>
              <BsTrash className="me-1" /> Delete
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default DepartmentView;