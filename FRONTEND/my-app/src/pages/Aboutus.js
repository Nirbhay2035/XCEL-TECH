import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import networking from "../assets/networking.jpg";
import mission from "../assets/mission.jpg";

export default function About() {
  return (
    <div className="min-vh-100 bg-dark text-light py-5">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h1 className="text-primary">About Xcel-Tech</h1>
            <p className="lead">Empowering Connectivity with Cutting-Edge Technology</p>
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col md={6}>
          <Image src={networking}alt="Networking" fluid rounded />
          </Col>
          <Col md={6}>
            <h2 className="text-primary">Who We Are</h2>
            <p>
              Xcel-Tech is a leading provider of high-speed, reliable networking and telecommunications solutions.
              We specialize in delivering fiber-optic broadband, VoIP solutions, and advanced networking infrastructure 
              for businesses and homes.
            </p>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={6}>
            <h2 className="text-primary ">Our Mission</h2>
            <p>
              Our mission is to bridge the digital divide by providing cutting-edge technology 
              and seamless connectivity solutions to individuals and businesses worldwide.
            </p>
          </Col>
          <Col md={6}>
            <Image src={mission} alt="Mission" fluid rounded />
          </Col>
        </Row>
      </Container>
      <hr></hr>
    </div>
  );
}
