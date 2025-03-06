import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row className="text-center text-md-start">
          {/* About Section */}
          <Col md={3} className="mb-3">
            <h5 className="text-primary">Xcel-Tech</h5>
            <p className="small">
              Providing high-speed, reliable networking and telecom solutions for businesses and homes.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={3} className="mb-3">
            <h5 className="text-primary">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/services" className="text-light text-decoration-none">Services</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none">About Us</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
              <li><Link to="/faq" className="text-light text-decoration-none">FAQ</Link></li>
            </ul>
          </Col>

          {/* Contact Details */}
          <Col md={3} className="mb-3">
            <h5 className="text-primary">Contact</h5>
            <p className="small mb-1">📍 123, Tech Park, City, Country</p>
            <p className="small mb-1">📞 +1 234 567 890</p>
            <p className="small">✉️ support@xceltech.com</p>
          </Col>

          {/* Social Media Links */}
          <Col md={3} className="mb-3">
            <h5 className="text-primary">Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="text-light" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="text-light" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="text-light" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="text-light" />
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright Section */}
        <hr className="bg-light"/>
        <p className="text-center small">&copy; {new Date().getFullYear()} Xcel-Tech. All Rights Reserved.</p>
      </Container>
    </footer>
  );
}
