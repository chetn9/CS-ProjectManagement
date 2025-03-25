import {React, useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { database } from "../Firebase/firebase-config";
import { getDatabase, get, ref, onValue, remove, update } from "firebase/database";
import LinkButton from "../Components/UpdateLinkButton";
import ShimmerLoader from "../Components/ShimmerEffect";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function StudentProjects() {

    const [projectData, setProjectData] = useState(null);
    const [dueDate, setDueDate] = useState('');

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

                projectArray[0].DueDate ? setDueDate(projectArray[0].DueDate) : setDueDate("No date found");
                // if(projectArray[0].DueDate || projectArray[0].DueDate != "" || projectArray[0].DueDate != null)
                // {
                //     const getDueDate = projectArray[0].DueDate;
                //     setDueDate(getDueDate);
                // }
                // else
                // {
                //     setDueDate("No date found");
                // }

                setProjectData(projectArray);
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

    // const inputDate = (e)=>{
    //     const {name, value} = e.target;
    //     setDueDate((data)=>({
    //         ...data,
    //         [name]: value,
    //     }));
    // }

    const formSubmit = async (e)=>{
        e.preventDefault();

        const dataRef = ref(database, 'projects/data');

        const date = e.target[0].value;

        if(date == "" || date == null)
        {
            console.log("Due Date"+dueDate);
            alert('Select date');
        }
        else if(date < new Date().toISOString().split('T')[0])
        {
            alert('Select valid date!');
        }
        else
        {
            console.log("Due Date"+dueDate);
            const projectSnap = await get(dataRef);
            if(projectSnap.exists())
            {
                const getData = projectSnap.val();
                const updated = {};

                for(let projectId in getData)
                {
                    // console.log(projectId);
                    updated[`${projectId}/DueDate`] = date;
                }

                await update(dataRef, updated);

                MySwal.fire({
                    title: "Project submission Date updated!",
                    icon: "success",
                    draggable: true
                });
            }
            else
            {
                alert("No Data found");
            }
            // onValue(dataRef, (snapshot)=>{
            //     const data = snapshot.val();
            //     // console.log(data);
            // });
            // update(dataRef, {
            //     DueDate: date,
            // }).then(()=>{
            //     alert("Due Date Added");
            // }).catch((error)=>{
            //     console.error("Error", error);
            // });
            // console.log(date);
        }
    }

    const deleteProject = (id)=>{
        const dataRef = ref(database, "projects/data/"+id);

        MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                remove(dataRef);
                
                MySwal.fire({
                title: "Deleted! ",
                text: "Record has been deleted.",
                icon: "success"
              });
            }
        });
    }

    return (
        <>
            <div className="container-fluid mt-3">
            
                <div className="row mx-1">
                    
                    <div className="card">
                        <form onSubmit={formSubmit}>
                            <input type="date" name="dueDate" id="" />
                            <button type="submit" className="btn btn-primary">Project submission Date</button>
                        </form>
                    </div>

                    <div className="card border border-dark p-0">
                        <div className="card-header bg-dark text-light">
                            <h5 className="my-auto">Student Projects</h5>
                        </div>
                        <div className="card-body">
                            {
                                projectData === null ? (
                                    <ShimmerLoader />
                                ) : (
                                    <div className="table-responsive">

                                    <table className="table table-bordered text-center text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Project Title</th>
                                                {/* <th>Description</th> */}
                                                <th>Due Date</th>
                                                {/* <th>Student ID</th> */}
                                                {/* <th>Group ID</th> */}
                                                <th>Faculty 1</th>
                                                <th>Faculty 2</th>
                                                <th>Project Status</th>
                                                <th>Task List</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-nowrap">
                                            {
                                                projectData.map((item, index)=>(
                                                
                                                    <tr key={item.id}>
                                                        <td>{index+1}</td>
                                                        <td>{item.Title}</td>
                                                        {/* <td>{item.Description}</td> */}
                                                        <td>{item.DueDate ? item.DueDate : "Not set Due Date"}</td>
                                                        {/* <td>{item.UserId ? item.UserId : "With-Group"}</td> */}
                                                        {/* <td>{item.GroupId ? item.GroupId : "-"}</td> */}
                                                        <td>{item.Faculty ? item.Faculty.Faculty1 : "Faculty not Assigned"}</td>
                                                        <td>{item.Faculty ? item.Faculty.Faculty2 : "Faculty not Assigned"}</td>
                                                        <td> <span className={`badge text-light ${item.ProjectStatus ? (item.ProjectStatus == 'Completed' ? 'bg-success' : 'bg-primary') : "text-dark" } `}> {item.ProjectStatus ? item.ProjectStatus : "-"} </span></td>
                                                    
                                                        <td>
                                                            <LinkButton to={`/Task-List/${item.ProjectId}`} className="btn btn-outline-success" icon={<i class="bi bi-list-task"></i>}/>

                                                        </td>
                                                        <td>
                                                            <LinkButton className="btn btn-outline-dark" icon={<i className="bi bi-info-circle"></i>} text={"View Detail"}/>
                                                            <span className="mx-2"></span>
                                                            <LinkButton to={`/Project-Edit/${item.ProjectId}`} className="btn btn-outline-primary" text={"Edit"}/>
                                                            <span className="mx-1"></span>
                                                            <button onClick={()=>deleteProject(item.id)} className="btn btn-outline-danger">Remove</button>
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