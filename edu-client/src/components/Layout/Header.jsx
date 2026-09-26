// src/components/Layout/Header.jsx

import React from "react";
import { Navbar, Container } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">EduManager</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
