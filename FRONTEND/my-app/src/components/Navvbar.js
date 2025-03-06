import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Button, Container } from "react-bootstrap";

const Navvbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navLinkStyle = {
    transition: "color 0.3s ease",
    fontSize: "1.5rem",
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container className="px-0">
        <Navbar.Brand as={Link} to="/" style={{ fontSize: "1.6rem", fontWeight: "bold" }}>
          XCEL-Tech
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Show Home & Services only for users and guests, not admins */}
            {!user || user.role !== "admin" ? (
              <>
                <Nav.Link as={Link} to="/" style={navLinkStyle}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/services" style={navLinkStyle}>
                  Services
                </Nav.Link>
              </>
            ) : null}

            {user ? (
              user.role === "admin" ? (
                // Admin Links
                <NavDropdown title="Admin Panel" id="admin-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/" style={navLinkStyle}>
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/manage-users" style={navLinkStyle}>
                    Manage Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/manage-services" style={navLinkStyle}>
                    Manage Services
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/manage-bookings" style={navLinkStyle}>
                    Manage Bookings
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/reports" style={navLinkStyle}>
                    Reports
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                // User Links
                <>
                  <Nav.Link as={Link} to="/bookings" style={navLinkStyle}>
                    Bookings
                  </Nav.Link>
                  <Nav.Link as={Link} to="/faqs" style={navLinkStyle}>
                    FAQs
                  </Nav.Link>
                  <Nav.Link as={Link} to="/about" style={navLinkStyle}>
                    About-us
                  </Nav.Link>
                </>
              )
            ) : null}
          </Nav>

          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3 text-light">Welcome, {user.email}</Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline-light" as={Link} to="/login" className="me-2">Login</Button>
                <Button variant="light" as={Link} to="/register">Sign Up</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navvbar;
