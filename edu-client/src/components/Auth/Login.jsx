import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import AuthContext from '../../context/AuthProvider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
   
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        const result = await login(email, password);

        if (result.isAuthSuccessful) {
           
            if (result.role === 'Admin') {
                navigate('/departments'); 
            } else if (result.role === 'Teacher') {
                navigate('/my-courses'); 
            } else if (result.role === 'Student') {
                navigate('/my-enrollments'); 
            } else {
                navigate('/'); 
            }
        } else {
            setError(result.errorMessage || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '25rem' }}>
                <Card.Body>
                    <Card.Title className="text-center">Login</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Log In
                        </Button>
                    </Form>
                    <div className="mt-3 text-center">
                        <Card.Text>Don't have an account? <Link to="/register">Register here</Link></Card.Text>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;