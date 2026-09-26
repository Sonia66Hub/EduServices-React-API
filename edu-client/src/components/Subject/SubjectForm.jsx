import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { getSubjectById, createSubject, updateSubject } from "../../services/subjectService";
import { getCourses } from "../../services/courseService";

function SubjectForm({ onSaved, onCancel }) {
  const location = useLocation();
  const [subject, setSubject] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const isEditing = !!subject;

  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const coursesRes = await getCourses();
        setCourses(coursesRes.data);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Failed to load courses.");
        setLoading(false);
        return;
      }

      
      if (location.state && location.state.subject) {
        const fetchedSubject = location.state.subject;
        setSubject(fetchedSubject);
        setSubjectName(fetchedSubject.subjectName || "");
        setCourseId(fetchedSubject.courseId ? String(fetchedSubject.courseId) : "");
      } else {
        const id = location.pathname.split('/').pop();
        if (id && id !== 'add') {
          try {
            const subjectRes = await getSubjectById(id);
            const fetchedSubject = subjectRes.data;
            setSubject(fetchedSubject);
            setSubjectName(fetchedSubject.subjectName || "");
            setCourseId(fetchedSubject.courseId ? String(fetchedSubject.courseId) : "");
          } catch (err) {
            console.error("Failed to load subject data:", err);
            setError("Failed to load subject data.");
          }
        }
      }
      setLoading(false);
    };

    loadData();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!courseId) {
      setError("Please select a course.");
      setLoading(false);
      return;
    }

    const payload = {
      subjectName,
      courseId: parseInt(courseId),
    };

    try {
      if (isEditing) {
        payload.subjectId = subject.subjectId;
        await updateSubject(subject.subjectId, payload);
      } else {
        await createSubject(payload);
      }
      onSaved();
    } catch (err) {
      console.error("Save Subject Error:", err);
      setError("Failed to save subject. " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2>{isEditing ? "Edit Subject" : "Add Subject"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="subjectName">
          <Form.Label>Subject Name</Form.Label>
          <Form.Control
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="courseId">
          <Form.Label>Course</Form.Label>
          <Form.Select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Save"}
        </Button>{" "}
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Back to List
        </Button>
      </Form>
    </div>
  );
}

export default SubjectForm;