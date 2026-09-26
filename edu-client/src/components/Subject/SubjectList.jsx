import React, { useEffect, useState } from "react";
import { getSubjects, deleteSubject } from "../../services/subjectService";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { BsPencil, BsTrash, BsEye } from "react-icons/bs";

function SubjectList({ onAdd, onEdit, onView }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const res = await getSubjects();
      setSubjects(res.data);
      setError("");
    } catch {
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await deleteSubject(id);
        loadSubjects();
      } catch {
        alert("Delete failed.");
      }
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const filteredSubjects = subjects.filter(subject =>
    subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
       
        <div>
          <h2>Subjects</h2>
          <Button onClick={onAdd} className="mt-2">Add Subject</Button>
        </div>

        
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            style={{ width: "200px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : filteredSubjects.length === 0 ? (
        <Alert variant="info" className="text-center">No subjects found.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject.subjectId}>
                <td>{subject.subjectId}</td>
                <td>{subject.subjectName}</td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => onView(subject)}
                    className="me-2"
                  >
                    <BsEye /> View
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => onEdit(subject)}
                    className="me-2"
                  >
                    <BsPencil /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(subject.subjectId)}
                  >
                    <BsTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default SubjectList;