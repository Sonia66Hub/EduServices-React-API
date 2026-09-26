import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Card, Row, Col, Image } from "react-bootstrap";
import { createStudent, updateStudent } from "../../services/studentService";

const StudentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = id !== undefined;
  const initialStudent = location.state?.student || {};

  const [student, setStudent] = useState({
    fullName: initialStudent.fullName || "",
    email: initialStudent.email || "",
    dateOfBirth: initialStudent.dateOfBirth ? initialStudent.dateOfBirth.split("T")[0] : "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [currentPictureUrl, setCurrentPictureUrl] = useState(initialStudent.picture || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      setCurrentPictureUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

   
    const formData = new FormData();
    formData.append("FullName", student.fullName);
    formData.append("Email", student.email);
    formData.append("DateOfBirth", student.dateOfBirth);
    
    
    if (photoFile) {
      formData.append("PictureFile", photoFile);
    }

    try {
      if (isEditMode) {
        await updateStudent(id, formData);
        alert("Student updated successfully!");
      } else {
        await createStudent(formData);
        alert("Student created successfully!");
      }
      navigate("/students");
    } catch (err) {
      console.error("Failed to save student", err);
      
     
      if (err.response && err.response.data) {
        
        if (err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors)
            .flat()
            .join(' ');
          setError(`Failed to save student: ${errorMessages}`);
        } else {
          
          setError(`Failed to save student: ${err.response.data.title || 'An unknown server error occurred.'}`);
        }
      } else {
       
        setError("Failed to save student. Please check your network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/students");
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5" className="text-white bg-primary">
        {isEditMode ? "Edit Student" : "Add New Student"}
      </Card.Header>
      <Card.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="fullName" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={student.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={student.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="dateOfBirth" className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={student.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="photoFile" className="mb-3">
                <Form.Label>Photo</Form.Label>
                {(isEditMode && currentPictureUrl) || (!isEditMode && currentPictureUrl) ? (
                  <div className="mb-2">
                    <Image
                      src={currentPictureUrl}
                      alt="Current Student"
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                      rounded
                    />
                  </div>
                ) : null}
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end mt-4">
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={handleBack}
            >
              Back to List
            </Button>
            <Button
              variant="success"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default StudentForm;