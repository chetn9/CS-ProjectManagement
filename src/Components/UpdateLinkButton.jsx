import React from 'react';
import { Link } from 'react-router-dom'

const LinkButton = ({to, type, text, className="btn btn-outline-primary", icon=<i className="bi bi-pencil"></i>})=> {
    return(
        <Link to={to} type={type} className={className}> {icon} {text}</Link>
    );
};

export default LinkButton;