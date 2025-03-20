import React from 'react';
import { Link } from 'react-router-dom'

const LinkButton = ({to, text, className, icon=<i className="bi bi-pencil"></i>})=> {
    return(
        <Link to={to} className={className}> {icon} {text}</Link>
    );
};

export default LinkButton;