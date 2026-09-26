import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { getCourseById, createCourse, updateCourse } from "../../services/courseService";

function CourseForm({ onSaved, onCancel }) {
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const isEditing = !!course;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      if (location.state && location.state.course) {
        const fetchedCourse = location.state.course;
        setCourse(fetchedCourse);
        setCourseName(fetchedCourse.courseName || "");
        setLoading(false);
      } else {
        const id = location.pathname.split('/').pop();
        if (id && id !== 'add') {
          try {
            const courseRes = await getCourseById(id);
            const fetchedCourse = courseRes.data;
            setCourse(fetchedCourse);
            setCourseName(fetchedCourse.courseName || "");
          } catch (err) {
            console.error("Failed to load course data:", err);
            setError("Failed to load course data.");
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        courseName: courseName,
      };
      
      if (isEditing) {
        if (!course || !course.courseId) {
          setError("Course ID is missing for update.");
          setSaving(false);
          return;
        }
        await updateCourse(course.courseId, payload);
      } else {
        await createCourse(payload);
      }
      onSaved();
    } catch (err) {
      console.error("Save Course Error:", err);
      const errorMessage = err.response?.data?.message || "Failed to save course. Please try again.";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2>{isEditing ? "Edit Course" : "Add Course"}</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="courseName">
          <Form.Label>Course Name</Form.Label>
          <Form.Control
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            placeholder="Enter course name"
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? (
            <>
              <Spinner animation="border" size="sm" /> Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>{" "}
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Back to List
        </Button>
      </Form>
    </div>
  );
}

export default CourseForm;