import {React, useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue } from "firebase/database";
import LinkButton from "../Components/UpdateLinkButton";

function StudentProjects() {

    const [projectData, setProjectData] = useState(null);

    // useEffect(() => {
    //     const getData = async () => {
    //         try
    //         {
    //             await axios.get("http://127.0.0.1:8000/api/Projects")
    //             .then((response) => {
    //                 const projects = Object.values(response.data);
    //                 setProjectData(projects);
    //                 console.log(response.data);
    //             }).catch((error)=>{
    //                 console.log(error);
    //             });
    //         }
    //         catch(error)
    //         {
    //             console.error(error);
    //         }
    //     };

    //     getData();
    // },[]);

    useEffect(()=>{
        const dataRef = ref(database, 'projects/data');

        onValue(dataRef, (snapshot) => {
            const dataFromFirebase = snapshot.val();

            if(dataFromFirebase)
            {
                const projectArray = Object.entries(dataFromFirebase).map(([id, project]) => ({
                    id,
                    ...project,
                }));

                setProjectData(projectArray);
                // console.log(projectArray);
            }
            else
            {
                setProjectData([]);
            }
        });
                
        return () => {
            setProjectData(null);
        };

    }, []);

    return (
        <>
            <div className="container-fluid mt-3">
            
                <div className="row mx-1">
                    <div className="card border border-dark p-0">
                        <div className="card-header bg-dark text-light">
                            <h5 className="my-auto">Student Projects</h5>
                        </div>
                        <div className="card-body">
                            {
                                projectData === null ? (
                                    <p>Loading Data</p>
                                ) : (
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
                                                
                                                    <tr key={item.id}>
                                                        <td>{index+1}</td>
                                                        <td>{item.Title}</td>
                                                        <td>{item.Description}</td>
                                                        <td>{item.due_date ? item.due_date : "Not set Due Date"}</td>
                                                        <td>{item.UserId ? item.UserId : "With-Group"}</td>
                                                        <td>{item.GroupId ? item.GroupId : "-"}</td>
                                                        <td>{item.Faculty ? item.Faculty.Faculty1 : "Faculty not Assigned"}</td>
                                                        <td>{item.Faculty ? item.Faculty.Faculty2 : "Faculty not Assigned"}</td>
                                                        <td> <span className={`badge text-light ${item.ProjectStatus ? (item.ProjectStatus == 'Completed' ? 'bg-success' : 'bg-primary') : "text-dark" } `}> {item.ProjectStatus ? item.ProjectStatus : "-"} </span></td>
                                                    
                                                        <td>

                                                            <LinkButton to={`/Project-Edit/${item.ProjectId}`} className="btn btn-outline-primary" text={"Edit"}/>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    </div>
                                )
                            }
                            
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default StudentProjects;