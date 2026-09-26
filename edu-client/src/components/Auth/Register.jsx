import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5088/api";

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Student', 
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/Auth/register`, formData);
            if (response.data.isAuthSuccessful) {
                setSuccessMessage("Registration successful! You can now log in.");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(response.data.errorMessage || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data.errorMessage || "An error occurred during registration.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '25rem' }}>
                <Card.Body>
                    <Card.Title className="text-center">Register</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password" 
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password" 
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="formBasicRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Select 
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="Student">Student</option>
                                <option value="Admin">Admin</option>
                                <option value="Teacher">Teacher</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100">
                            Register
                        </Button>
                    </Form>
                    <div className="mt-3 text-center">
                        <Card.Text>Already have an account? <Link to="/login">Login here</Link></Card.Text>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;