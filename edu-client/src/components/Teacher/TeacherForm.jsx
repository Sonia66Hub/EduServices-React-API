import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createTeacher, updateTeacher, getTeacher } from "../../services/teacherService";
import { getDepartments } from "../../services/departmentService";
import { Form, Button, Spinner, Alert } from "react-bootstrap";

function TeacherForm({ onSaved, onClose }) {
  const location = useLocation();
  const [teacher, setTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    departmentId: "",
    pictureFile: null,
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const isEditing = !!teacher;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const departmentsRes = await getDepartments();
        setDepartments(departmentsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load departments.");
      }

      if (location.state && location.state.teacher) {
        const fetchedTeacher = location.state.teacher;
        setTeacher(fetchedTeacher);
        setFormData({
          name: fetchedTeacher.name || "",
          departmentId: fetchedTeacher.departmentId || "",
          pictureFile: null,
        });
        setImagePreviewUrl(fetchedTeacher.picture || "");
      } else {
        const id = location.pathname.split('/').pop();
        if (id && id !== 'add') {
          try {
            const res = await getTeacher(id);
            const fetchedTeacher = res.data;
            setTeacher(fetchedTeacher);
            setFormData({
              name: fetchedTeacher.name || "",
              departmentId: fetchedTeacher.departmentId || "",
              pictureFile: null,
            });
            setImagePreviewUrl(fetchedTeacher.picture || "");
          } catch (err) {
            console.error("Failed to fetch teacher:", err);
            setError("Failed to load teacher data.");
          }
        }
      }
      setLoading(false);
    };
    loadData();
  }, [location]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pictureFile") {
      const file = files[0];
      setFormData({ ...formData, pictureFile: file });
      if (file) {
        setImagePreviewUrl(URL.createObjectURL(file));
      } else {
        setImagePreviewUrl("");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("departmentId", formData.departmentId);
    if (formData.pictureFile) {
      data.append("pictureFile", formData.pictureFile);
    }
    
    if (isEditing && !formData.pictureFile && teacher.picture) {
        data.append("picture", teacher.picture);
    }
    
    
    if (isEditing) {
      data.append("teacherId", teacher.teacherId);
    }

    try {
      if (isEditing) {
        await updateTeacher(teacher.teacherId, data);
      } else {
        await createTeacher(data);
      }
      onSaved();
    } catch (error) {
      console.error(error);
      setError("Failed to save teacher. " + (error.response?.data || error.message)); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2>{isEditing ? "Edit" : "Add"} Teacher</h2>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Department</Form.Label>
          <Form.Select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.departmentName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Picture</Form.Label>
          <Form.Control type="file" name="pictureFile" onChange={handleChange} />
        </Form.Group>

        {imagePreviewUrl && (
          <div className="mb-3">
            <img
              src={imagePreviewUrl}
              alt="Preview"
              height="100"
              style={{ borderRadius: "5px" }}
            />
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Save"}
        </Button>{" "}
        <Button variant="secondary" onClick={onClose}>
          Back to List
        </Button>
      </Form>
    </div>
  );
}

export default TeacherForm;