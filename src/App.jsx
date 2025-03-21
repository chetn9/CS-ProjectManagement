import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)




import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import Header from './Components/Header';
import Dashboard from './Pages/Dashboard';
import StudentList from "./Pages/Student-List";
import AddNewRecord from "./Pages/Add-New-Record";

function App() {

	return (
		<>
			<Header/>
		</>
	)
}

export default App
