import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from "../Pages/Dashboard";
import StudentList from "../Pages/Student-List";
import AddNewRecord from "../Pages/Add-New-Record";

function Header() {
    return (
        <>
            <Router>
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="/">CS Project Management</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav mx-auto">
                            <Nav className="mx-auto">
                                <Link to="/" className="nav-link mx-2">Home</Link>
                                
                                <NavDropdown title="Manage Students" className="mx-2" id="basic-nav-dropdown">
                                    
                                    <NavDropdown.Item href="#action/3.2">
                                        <Link to="/Student-List" className="nav-link">Student List</Link>
                                    </NavDropdown.Item>

                                    
                                    
                                </NavDropdown>

                                <NavDropdown title="Manage Faculty" className="mx-2" id="basic-nav-dropdown">
                                   
                                </NavDropdown>

                                <Link to="/Add-New" className="nav-link mx-2">Add New Record</Link>

                            
                            </Nav>
                        </Navbar.Collapse>
                    </Container>

                    
                </Navbar>

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/Student-List" element={<StudentList />} />
                    <Route path="/Add-New" element={<AddNewRecord />} />
                </Routes>
            </Router>
            
            
        </>
    )
}

export default Header;