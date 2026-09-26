import React, { useEffect, useState } from "react";
import { getTeachers, deleteTeacher } from "../../services/teacherService";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import { BsPencil, BsTrash, BsEye } from "react-icons/bs";

function TeacherList({ onEdit, onAdd, onView }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadTeachers = async () => {
    try {
      const res = await getTeachers();
      setTeachers(res.data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to load teachers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await deleteTeacher(id);
        loadTeachers();
      } catch (error) {
        console.error(error);
        setError("Failed to delete teacher.");
      }
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const getImageUrl = (picturePath) => {
    if (!picturePath) return "";
    return picturePath.startsWith("http") ? picturePath : `https://localhost:5088/${picturePath.replace(/\\/g, '/')}`;
  };

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
      
        <div>
          <h2>Teachers</h2>
          <Button onClick={onAdd} className="mt-2">Add Teacher</Button>
        </div>
        
      
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or department..."
            style={{ width: "250px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {filteredTeachers.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Picture</th>
              <th>Name</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((t) => (
              <tr key={t.teacherId}>
                <td>
                  {t.picture && (
                    <img
                      src={getImageUrl(t.picture)}
                      width="60"
                      height="60"
                      alt={t.name}
                      style={{ objectFit: "cover", borderRadius: "5px" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.png";
                      }}
                    />
                  )}
                </td>
                <td>{t.name}</td>
                <td>{t.departmentName}</td>
                <td>
                  <Button size="sm" onClick={() => onView(t)} className="me-2">View</Button>
                  <Button size="sm" onClick={() => onEdit(t)} className="me-2">Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(t.teacherId)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info" className="text-center">No teachers found.</Alert>
      )}
    </div>
  );
}

export default TeacherList;