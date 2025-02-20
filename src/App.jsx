import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import Header from './Components/Header';
import Dashboard from './Pages/Dashboard';

function App() {
	const [count, setCount] = useState(0)

	return (
		<>
			<Header/>
			{/* <Dashboard/> */}
		</>
	)
}

export default App
