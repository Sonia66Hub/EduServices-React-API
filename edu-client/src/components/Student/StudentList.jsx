import React, { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "../../services/studentService";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import { BsPencil, BsTrash, BsEye } from "react-icons/bs";

function StudentList({ onEdit, onView, onAdd }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await deleteStudent(id);
        loadStudents();
      } catch (error) {
        console.error(error);
        setError("Failed to delete student.");
      }
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const getImageUrl = (picturePath) => {
    if (!picturePath) return "";
    return picturePath.startsWith("http") ? picturePath : `http://localhost:5088/${picturePath.replace(/\\/g, '/')}`;
  };

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
       
        <div>
          <h2>Students</h2>
          <Button onClick={onAdd} className="mt-2">Add Student</Button>
        </div>
        
       
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            style={{ width: "250px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Picture</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No students found.</td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.studentId}>
                  <td>
                    {s.picture && (
                      <img
                        src={getImageUrl(s.picture)}
                        width="60"
                        height="60"
                        alt={s.fullName}
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "http://localhost:5088/noimage.png"; 
                        }}
                      />
                    )}
                  </td>
                  <td>{s.fullName}</td>
                  <td>{s.email}</td>
                  <td>
                    <Button size="sm" onClick={() => onView(s)} className="me-2"><BsEye /> View</Button>
                    <Button size="sm" onClick={() => onEdit(s)} className="me-2"><BsPencil /> Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(s.studentId)}><BsTrash /> Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default StudentList;