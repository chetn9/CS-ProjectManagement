import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { HashRouter as Router, Route, Routes, Link, redirect, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import StudentList from "../Pages/Student-List";
import ProjectList from "../Pages/Student-Projects";
import AddNewRecord from "../Pages/Add-New-Record";
import EditProject from "../Pages/Edit-Project";
import EditStudent from "../Pages/Students/Edit-Student";
import FacultyList from "../Pages/Faculty-List";
import Login from "../Pages/Login";
import ManageTechDatabase from "../Pages/Tech-Database/ManageTech-Database";
import ManageStream from "../Pages/Tech-Database/ManageStream";
import ManageTask from "../Pages/Tasks/ManageTasks";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import ProtectedRoute from "../Pages/Auth/ProtectedRoute";
import SideBar from "./Sidebar";
import Footer from "./Footer";
import logo from "../assets/cs_app_round_logo.png";
import ProfilePage from "../Pages/Profile-Page";

function Header({isValid}) {

    const location = useLocation();

    const userid = sessionStorage.getItem("user");
    
    const [sidebarActive, setSidebarActive] = useState(false);

    // const toggleSidebar = () => {
    //     setSidebarActive(!sidebarActive);
    // };

    const [showBtn, setShowBtn] = useState(false);

    useEffect(()=>{
        setShowBtn(isValid);
    }, [isValid])

    const [isSidebarActive, setIsSidebarActive] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarActive(prevState => !prevState);
        document.body.classList.toggle('toggle-sidebar'); // This mimics the original behavior
    };

    return (
        <>
        {/* <Router basename="/">
        </Router> */}
            <div>
            
            {/* #16a085 */}
                <Navbar expand="lg" className="fixed-top" style={{backgroundColor: "#3867d6", borderRadius: "10px", margin: "5px", height: "60px", position: "sticky"}}>
                        <Container>
                            
                            {
                                showBtn &&
                                <i className="bi bi-list me-3 toggle-sidebar-btn text-light" onClick={toggleSidebar}></i>
                            }
                        
                            <Link className="nav-link fw-bold me-lg-auto mx-lg-0 mx-auto navbar-brand text-light" to="/">CS Project Management</Link>
                            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
                            {/* <Navbar.Collapse id="basic-navbar-nav mx-auto">
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

                                    <Link to="/Manage-Stream" className="nav-link mx-2">Manage Stream</Link>
                                    <Link to="/Manage-TechDatabase" className="nav-link">Manage Tech & Database</Link>
                                    
                                
                                </Nav>
                            </Navbar.Collapse> */}
                        </Container>
                </Navbar>

                {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                    <div className="container-fluid">
                        <button className="btn btn-outline-light" onClick={toggleSidebar}>
                            ☰
                        </button>
                        <a className="navbar-brand ms-3" href="#">
                            My Website
                        </a>
                    </div>
                </nav> */}

                {
                    userid &&
                    <SideBar showBtn={showBtn}/>
                }

                {/* <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
                    <ul>
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

                                    <Link to="/Manage-Stream" className="nav-link mx-2">Manage Stream</Link>
                                    <Link to="/Manage-TechDatabase" className="nav-link">Manage Tech & Database</Link>
                                    {
                                        showBtn && 
                                        <button type="submit" onClick={logOutBtn} className="btn btn-danger btn-sm">Log Out</button>
                                    }
                                    </Nav>
                    </ul>
                </div> */}

                <Routes>
                
                    <Route path="/Login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute sidebarActive={sidebarActive} />}>
                
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/Student-List" element={<StudentList /> } />

                        <Route path="/Add-New" element={<AddNewRecord />} />
                        <Route path="/Faculty-List" element={<FacultyList />} />
                        <Route path="/Project-List" element={<ProjectList />} />
                        <Route path="/Project-Edit/:projectId" element={<EditProject />} />
                        <Route path="/Edit-Student/:studentId" element={<EditStudent /> } />
                    
                        <Route path="/Manage-Stream" element={<ManageStream />} />
                        <Route path="/Manage-TechDatabase" element={<ManageTechDatabase />} />
                        <Route path="/Task-List/:projectId" element={<ManageTask /> }/>
                        <Route path="/Profile" element={<ProfilePage/>}/>
                    </Route>
                </Routes>

            </div>
                
        </>
    );
}

export default Header;