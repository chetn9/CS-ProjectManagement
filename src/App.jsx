import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import Dashboard from './Pages/Dashboard';
import StudentList from "./Pages/Student-List";
import ProjectList from "./Pages/Student-Projects";
import AddNewRecord from "./Pages/Add-New-Record";
import EditProject from "./Pages/Edit-Project";
import EditStudent from "./Pages/Students/Edit-Student";
import Login from "./Pages/Login";
import ManageTechDatabase from "./Pages/Tech-Database/ManageTech-Database";
import ManageStream from "./Pages/Tech-Database/ManageStream";
import ManageTask from "./Pages/Tasks/ManageTasks";
import Header from './Components/Header';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './Pages/Auth/ProtectedRoute';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

function App() {

	const [isUserValid, setIsUserValid] = useState(false);
	const [logOutBtn, setLogOutBtn] = useState(false);
	const auth = getAuth();

    useEffect(()=>{
        // const userId = localStorage.getItem("userId");
        // if(userId != "" && userId != null)
        // {
        //     setIsUserValid(true);	
		// 	setLogOutBtn(true);
        // }
        // else
        // {
        //     setIsUserValid(false);
		// 	setLogOutBtn(false);
        // }

		const unsubscribe = auth.onAuthStateChanged((user) => {
			setIsUserValid(!!user);
		});

		return unsubscribe;
		// console.log("User Logged In", isUserValid);
    }, []);

	useEffect(() => {
        // console.log("User Logged In:", isUserValid);
		setLogOutBtn(isUserValid);
    }, [isUserValid]);

	return (
		<>
			<Router basename='/'>
				{/* <ProtectedRoute /> */}
				<Header isValid={logOutBtn}  />
			</Router>
		</>
	);
}

export default App
