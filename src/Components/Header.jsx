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
import Login from "../Pages/Login";
import ManageTechDatabase from "../Pages/Tech-Database/ManageTech-Database";
import ManageStream from "../Pages/Tech-Database/ManageStream";
import ManageTask from "../Pages/Tasks/ManageTasks";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import ProtectedRoute from "../Pages/Auth/ProtectedRoute";

function Header({isValid}) {

    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();

    const [showBtn, setShowBtn] = useState(false);

    useEffect(()=>{
        setShowBtn(isValid);
        
    }, [isValid])

    // useEffect(()=>{
    //     const userId = localStorage.getItem("userId");
    //     if(userId)
    //     {
    //         setShowBtn(true);
    //     }else
    //     {
    //         setShowBtn(false);
    //     }
    // }, []);

    

    const logOutBtn = async ()=>{

        // if(isUserValid)
        // {
        //     // return <Navigate to="/Login"/>
        // }
        await signOut(auth);
        localStorage.removeItem("userId");
        // setIsAuthenticated(false);
        // useNavigate("/Login");
        navigate("/Login");
    }

    return (
        <>
        {/* <Router basename="/">
        </Router> */}
            <div>
                <Navbar expand="lg" className="bg-body-tertiary">
                        <Container>
                            <Link className="nav-link navbar-brand" to="/">CS Project Management</Link>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav mx-auto">
                                <Nav className="mx-auto">
                                    <Link to="/Dashboard" className="nav-link mx-2">Home</Link>
                                    
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
                            </Navbar.Collapse>
                        </Container>
                </Navbar>

                <Routes>
                
                    <Route path="/Login" element={<Login />  } />
                    <Route path="/" element={<ProtectedRoute/>}>
                
                        <Route path="/Dashboard" element={<Dashboard />} />
                        <Route path="/Student-List" element={<StudentList /> } />

                        <Route path="/Add-New" element={<AddNewRecord />} />
                        <Route path="/Project-List" element={<ProjectList />} />
                        <Route path="/Project-Edit/:projectId" element={<EditProject />} />
                        <Route path="/Edit-Student/:studentId" element={<EditStudent /> } />
                    
                    
                        <Route path="/Manage-Stream" element={<ManageStream />} />
                        <Route path="/Manage-TechDatabase" element={<ManageTechDatabase />} />
                        <Route path="/Task-List/:projectId" element={<ManageTask /> }/>
                    </Route>
                </Routes>
                
            </div>
                
        </>
    );
}

export default Header;