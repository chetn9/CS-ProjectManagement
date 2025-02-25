import {React, useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function StudentProjects() {

    const [projectData, setProjectData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try
            {
                await axios.get("http://127.0.0.1:8000/api/Projects")
                .then((response) => {
                    const projects = Object.values(response.data);
                    setProjectData(projects);
                    console.log(response.data);
                }).catch((error)=>{
                    console.log(error);
                });
            }
            catch(error)
            {
                console.error(error);
            }
        };

        getData();
        

    },[]);
    return (
        <>
            <div className="container mt-3">
                
                <div className="row">
                    <div className="card p-0">
                        <div className="card-header">
                            <h5>Student Projects</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">

                            <table className="table  table-bordered text-center text-nowrap">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Project Title</th>
                                        <th>Description</th>
                                        <th>Due Date</th>
                                        <th>Student ID</th>
                                        <th>Group ID</th>
                                        <th>Faculty 1</th>
                                        <th>Faculty 2</th>
                                        <th>Project Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody className="text-nowrap">
                                    {
                                        projectData.map((item, index)=>(
                                        
                                            <tr>
                                                <td>{index+1}</td>
                                                <td>{item.Title}</td>
                                                <td>{item.Description}</td>
                                                <td>{item.due_date ? item.due_date : "Not set Due Date"}</td>
                                                <td>{item.UserId ? item.UserId : "With-Group"}</td>
                                                <td>{item.GroupId ? item.GroupId : "-"}</td>
                                                <td>{item.Faculty ? item.Faculty.Faculty1 : "Faculty not Assigned"}</td>
                                                <td>{item.Faculty ? item.Faculty.Faculty2 : "Faculty not Assigned"}</td>
                                                <td> <span className={`badge text-light ${item.ProjectStatus ? (item.ProjectStatus == 'Completed' ? 'bg-success' : 'bg-dark') : "text-dark" } `}> {item.ProjectStatus ? item.ProjectStatus : "-"} </span></td>
                                            
                                                <td><Link to={`/Project-Edit/${item.ProjectId}`} className="btn btn-outline-primary">Edit</Link>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default StudentProjects;