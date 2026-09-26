import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import {
  getDepartments,
  deleteDepartment,
} from "../../services/departmentService";
import { BsPencil, BsTrash, BsEye } from "react-icons/bs";

const DepartmentList = ({ onEdit = () => {}, onAdd = () => {}, onView = () => {} }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await getDepartments();
      setDepartments(res.data);
      setError(null);
    } catch (err) {
      console.error("Load error:", err);
      setError("Failed to load departments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        loadDepartments();
      } catch (err) {
        alert("Failed to delete department.");
        console.error(err);
      }
    }
  };

  const filteredDepartments = departments.filter((d) =>
    d.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col xs={12} sm={6}>
          <h2>Departments</h2>
          <Button onClick={onAdd} className="mt-2">Add New Department</Button>
        </Col>
        <Col xs={12} sm={6} className="d-flex justify-content-end align-items-center mt-3 mt-sm-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            style={{ width: "200px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>
      {filteredDepartments.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((d) => (
              <tr key={d.departmentId}>
                <td>{d.departmentId}</td>
                <td>{d.departmentName}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => onView(d)}>
                    <BsEye /> View
                  </Button>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => onEdit(d)}>
                    <BsPencil /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(d.departmentId)}>
                    <BsTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info" className="text-center">No departments found.</Alert>
      )}
    </Container>
  );
};

export default DepartmentList;