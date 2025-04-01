import {React, useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { database } from "../Firebase/firebase-config";
import { getDatabase, get, ref, onValue, remove, update } from "firebase/database";
import LinkButton from "../Components/UpdateLinkButton";
import ShimmerLoader from "../Components/ShimmerEffect";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import projectImg from "../assets/project_web_light_96.png";

function StudentProjects() {

    const [projectData, setProjectData] = useState(null);
    const [dueDate, setDueDate] = useState('');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const MySwal = withReactContent(Swal);
    DataTable.use(DT);

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

    useEffect(()=>{ // fetching project from firebase
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

    const handleShow = (e)=>{
        setShow(true);

        const dataRef = ref(database, `projects/data/${e}`);

        onValue(dataRef, (snapshot)=>{
            console.log(snapshot.val());
        });

        console.log(e);
    }

    // const inputDate = (e)=>{
    //     const {name, value} = e.target;
    //     setDueDate((data)=>({
    //         ...data,
    //         [name]: value,
    //     }));
    // }

    // Add date to Every Projects
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
                
                    <div className="card overflow-hidden p-0 cardForRadius">
                        <div className="card-header bg-white border-0 text-dark p-3">
                            <div className="d-lg-flex align-items-center projectCard">
                                <div className="d-flex">
                                    <img src={projectImg} style={{background: "#1e90ff"}} alt="" />
                                    <h3 className="mx-3 mt-2 fw-bold my-auto">Student Projects</h3>
                                </div>

                                <form onSubmit={formSubmit} className="mt-lg-0 mt-3 ms-auto d-flex align-items-center">
                                
                                    <input type="date" name="dueDate" className="border-primary form-control me-2"  id="" />
                                    <button type="submit" className="text-nowrap btn btn-primary"> Set Due Date</button>
                                </form>
                            </div>
                        </div>
                        <div className="card-body">
                            {
                                projectData === null ? (
                                    <ShimmerLoader />
                                ) : (
                                    <div className="table-responsive">

                                    <DataTable className="table table-bordered text-center text-nowrap">
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th className="text-center">Project Title</th>
                                                {/* <th>Description</th> */}
                                                <th className="text-center">Due Date</th>
                                                {/* <th>Student ID</th> */}
                                                {/* <th>Group ID</th> */}
                                                <th className="text-center">Faculty 1</th>
                                                <th className="text-center">Faculty 2</th>
                                                <th className="text-center">Project Status</th>
                                                <th className="text-center">Task List</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-nowrap">
                                            {
                                                projectData.map((item, index)=>(
                                                
                                                    <tr key={item.id}>
                                                        <td className="text-center">{index+1}</td>
                                                        <td className="text-center">{item.Title}</td>
                                                        {/* <td>{item.Description}</td> */}
                                                        <td className="text-center">{item.DueDate ? item.DueDate : "Not set Due Date"}</td>
                                                        {/* <td>{item.UserId ? item.UserId : "With-Group"}</td> */}
                                                        {/* <td>{item.GroupId ? item.GroupId : "-"}</td> */}
                                                        <td className="text-center">{item.Faculty ? item.Faculty.Faculty1 : "Faculty not Assigned"}</td>
                                                        <td className="text-center">{item.Faculty ? item.Faculty.Faculty2 : "Faculty not Assigned"}</td>
                                                        <td className="text-center"> <span className={`badge text-light ${item.ProjectStatus ? (item.ProjectStatus == 'Completed' ? 'bg-success' : 'bg-primary') : "text-dark" } `}> {item.ProjectStatus ? item.ProjectStatus : "-"} </span></td>
                                                    
                                                        <td className="text-center">
                                                            <LinkButton to={`/Task-List/${item.ProjectId}`} className="btn btn-outline-success" icon={<i className="bi bi-list-task"></i>}/>

                                                        </td>

                                                        <td className="text-center">
                                                            {/* <LinkButton onClick={handleShow} className="btn btn-outline-dark" icon={<i className="bi bi-info-circle"></i>} text={"View Detail"}/> */}
                                                            <button onClick={()=>handleShow(item.id)} className="btn btn-outline-dark"><i className="bi bi-info-circle"></i> View Detail</button>
                                                            <span className="mx-2"></span>
                                                            <LinkButton to={`/Project-Edit/${item.ProjectId}`} className="btn btn-outline-primary" text={"Edit"}/>
                                                            <span className="mx-1"></span>
                                                            <button onClick={()=>deleteProject(item.id)} className="btn btn-outline-danger">Remove</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </DataTable>
                                    </div>
                                )
                            }
                            
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className="col-lg-12">

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Project Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h4 className="text-center text-success">Stock market Portfolio Management App</h4>
                                <hr />
                                
                                <h5 >Due Date : <span className="badge badge-dark bg-dark">25-04-2025</span></h5>
                                <hr />

                                <div>
                                    <h5 className="text-center"><u>Group Details</u></h5>
                                    <div className="text-center mt-3">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <h6>Partner 1</h6>
                                                <p className="badge badge-dark bg-dark">CS</p>
                                            </div>

                                            <div className="col-lg-6">
                                                <h6>Partner 2</h6>
                                                <p className="badge badge-dark bg-dark">CS</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div>
                                    <h5 className="text-center"><u>Faculty Details</u></h5>
                                    <div className="text-center mt-3">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <h6>Faculty 1</h6>
                                                <p className="badge badge-dark bg-dark">CS</p>
                                            </div>

                                            <div className="col-lg-6">
                                                <h6>Faculty 2</h6>
                                                <p className="badge badge-dark bg-dark">CS</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />

                                <div className="row text-center">
                                    <div className="col-lg-6">
                                        <h5>Technology</h5>
                                        <p className="badge badge-dark bg-dark">React</p>
                                    </div>

                                    <div className="col-lg-6">
                                        <h5>Database</h5>
                                        <p className="badge badge-dark bg-dark">MongoDB</p>
                                    </div>
                                </div>

                                <hr />

                                <div>
                                    <h5>Project Status: <span className="badge badge-dark bg-primary">On Going</span></h5>
                                </div>
                            </Modal.Body>
                            
                            
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleClose}>
                                    Edit
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default StudentProjects;