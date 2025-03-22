import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import StudentList from "../Pages/Student-List";
import ProjectList from "../Pages/Student-Projects";
import AddNewRecord from "../Pages/Add-New-Record";
import EditProject from "../Pages/Edit-Project";
import EditStudent from "../Pages/Students/Edit-Student";
import Login from "../Pages/Login";
import ManageTechnology from "../Pages/Tech-Database/ManageTechnology";
import ManageDatabase from "../Pages/Tech-Database/ManageDatabase";

function Header() {
    return (
        <>
        <Router basename="/">
            <div>
            <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Link className="nav-link navbar-brand" to="/">CS Project Management</Link>
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

                                <Link to="/Project-List" className="nav-link mx-2">Project List</Link>

                                <Link to="/Add-New" className="nav-link mx-2">Add New Record</Link>

                                <Link to="/Manage-Technology" className="nav-link mx-2">Manage Technology</Link>
                                <Link to="/Manage-Database" className="nav-link mx-2">Manage Database</Link>

                            
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/Student-List" element={<StudentList />} />
				<Route path="/Add-New" element={<AddNewRecord />} />
				<Route path="/Project-List" element={<ProjectList />} />
				<Route path="/Project-Edit/:projectId" element={<EditProject />} />
				<Route path="/Edit-Student/:studentId" element={<EditStudent />} />
				<Route path="/Login" element={<Login />} />
				<Route path="/Manage-Technology" element={<ManageTechnology />} />
				<Route path="/Manage-Database" element={<ManageDatabase />} />
            </Routes>
            </div>
        </Router>
                
        </>
    )
}

export default Header;