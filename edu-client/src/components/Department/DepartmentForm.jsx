import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom"; 
import { getDepartmentById, createDepartment, updateDepartment } from "../../services/departmentService";

const DepartmentForm = ({ onSaved, onCancel }) => {
  const location = useLocation(); 
  const [department, setDepartment] = useState(null); 
  const [departmentName, setDepartmentName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEditing = !!department; 

  useEffect(() => {
    
    if (location.state && location.state.department) {
      setDepartment(location.state.department);
      setDepartmentName(location.state.department.departmentName);
    } else {
      
      const fetchDepartment = async () => {
        const id = location.pathname.split('/').pop();
        if (id && id !== 'add') { 
          try {
            const res = await getDepartmentById(id);
            setDepartment(res.data);
            setDepartmentName(res.data.departmentName);
          } catch (err) {
            console.error("Failed to fetch department:", err);
            setError("Failed to load department data.");
          }
        }
      };
      fetchDepartment();
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await updateDepartment(department.departmentId, {
          departmentId: department.departmentId,
          departmentName: departmentName,
        });
      } else {
        await createDepartment({ departmentName: departmentName });
      }
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      setError("Failed to save department.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h4>{isEditing ? "Edit Department" : "Create Department"}</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Department Name</Form.Label>
          <Form.Control
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? <Spinner animation="border" size="sm" /> : "Save"}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Back to List
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DepartmentForm;