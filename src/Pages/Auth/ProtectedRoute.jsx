// ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({sidebarActive}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const [isUserValid, setIsUserValid] = useState(false);

    useEffect(()=>{
        // const userId = localStorage.getItem("userId");
        const userId = sessionStorage.getItem("userId");
        if(userId != "" && userId != null)
        {
            setIsUserValid(true);	
            setLoading(false);
        }
        else
        {
            setIsUserValid(false);
            setLoading(false);
        }
		// console.log("User Logged In", isUserValid);
    }, []);
    
    
    if (loading) {
        return <div></div>; // Or a spinner
    }
    
    return isUserValid ? (<div id="main"> 
            <div className="main_body"> <Outlet /> </div>  
        </div>): (<Navigate to="/Login" />);
};

export default ProtectedRoute;