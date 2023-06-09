import { Navbar, Nav, Container, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const NavBar = () => {
  return (
    <Navbar className="nav-bar py-4" bg="dark" variant="dark" expand="md">
      <Container>
        <Col>
          <Navbar.Brand href="#home">
            {" "}
            <Image src={logo} className="shield-logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Col>
                <Nav.Link as={Link} to={"/dashboard"}>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to={"/policies"}>
                  Policies
                </Nav.Link>
                <Nav.Link as={Link} to={"/purchase"}>
                  Purchase Policy
                </Nav.Link>
                <Nav.Link as={Link} to={"/settings"}>
                  Settings
                </Nav.Link>
              </Col>
            </Nav>
          </Navbar.Collapse>
        </Col>
      </Container>
    </Navbar>
  );
};

export default NavBar;
