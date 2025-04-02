import React, { useEffect, useState } from "react";
import axios from "axios";
import { data, useParams } from "react-router-dom";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue, update, off } from "firebase/database";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function EditProject(){

    const {projectId} = useParams();

    const [error, setError] = useState({
        Title: "",
        Description: "",
        Faculty1: "",
        Faculty2: "",
        Technology: "",
        Database: ""
    });

    const [projectData, setProjectData] = useState({
        Title: "",
        Description: "",
        Technology: "",
        Faculty1: "",
        Faculty2: "",
        Database: ""
    });

    const [projectTechnology, setProjectTechnology] = useState(null);
    const [projectDatabase, setProjectDatabase] = useState("");
    const [techId, setTechId] = useState(null);
    const [facultyData, setFacultyData] = useState("");

    // For loading Project with ID
    useEffect(()=>{
        const dataRef = ref(database, 'projects/data/'+projectId);

        onValue(dataRef, (snapshot)=>{
            const dataFromFirebase = snapshot.val();

            if(dataFromFirebase)
            {
                if(snapshot.hasChild("Faculty"))
                {
                    setProjectData({
                        Title: dataFromFirebase.Title,
                        Description: dataFromFirebase.Description,
                        Faculty1 : dataFromFirebase.Faculty.Faculty1,
                        Faculty2 : dataFromFirebase.Faculty.Faculty2,
                        Technology: dataFromFirebase.Technology,
                        Database: dataFromFirebase.Database
                    });
                }
                else
                {
                    setProjectData({
                        Title: dataFromFirebase.Title,
                        Description: dataFromFirebase.Description,
                        Technology: dataFromFirebase.Technology,
                        Database: dataFromFirebase.Database
                    });
                }

                setTechId(dataFromFirebase.Technology);
                console.log("Project ID", dataFromFirebase.Title);
            }
            else
            {
                setProjectData({
                    Title: "",
                    Description: "",
                    Technology: "",
                    Database: ""
                });
            }
        });

        return () => {
            setProjectData({
                Title: "",
                Description: "",
                Technology: "",
                Database: ""
            });

            off(dataRef);
        };
        
    }, [projectId]);

    // Fetching Faculty

    useEffect(()=>{
        const dataRef = ref(database, "users");

        onValue(dataRef, (snapshot) => {
            const dataFromFirebase = snapshot.val();

            if(dataFromFirebase)
            {
                const usersArray = Object.entries(dataFromFirebase).map(([id, user]) => ({
                    id,
                    ...user,
                }));

                const facultyList = usersArray.filter((user) => user.Role === "Faculty");
                setFacultyData(facultyList);
                // console.log(studentData);
            }
            else
            {
                setFacultyData([]);
            }
        }); 

        return()=>{
            off(dataRef);
        }
    }, [])

    // Fetching Technology and Database
    useEffect(()=>{
        const techRef = ref(database, 'technology_database/technologies');

        onValue(techRef, (snapshot)=>{
            const techData = snapshot.val();

            if(techData)
            {
                const techArray = Object.entries(techData).map(([id, tech]) => ({
                    id,
                    ...tech
                }));

                setProjectTechnology(techArray);
            }
            else
            {
                setProjectTechnology([]);
            }
        });

        const dbRef = ref(database, 'technology_database/databases');

        onValue(dbRef, (snapshot)=>{
            const dbData = snapshot.val();

            if(dbData)
            {
                const dbArray = Object.entries(dbData).map(([id, db]) => ({
                    id,
                    ...db
                }));

                setProjectDatabase(dbArray);
            }
            else
            {
                setProjectDatabase([]);
            }
        });

        return ()=>{
            setProjectTechnology(null);
            setProjectDatabase(null);
            off(techRef);
            off(dbRef);
        };

    }, []);

    const inputData = (e)=> {
        const {name, value} = e.target;

        setProjectData((prevData)=>({
            ...prevData,
            [name]: value,
        }));

        console.log('Input', projectData);
    };

    const formValidation = ()=>{

        let formValid = true;
        let storeErrors = {};

        Object.keys(projectData).forEach((field) => {
            if (!projectData[field] || projectData[field].trim() === "" || projectData[field] === null) {
                storeErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                formValid = false;
            }
        });

        setError(storeErrors);

        return formValid
    }

    const formSubmit = async (e)=> {
        e.preventDefault();

        const projectRef = ref(database, 'projects/data/' + projectId);
        console.log(formValidation());
        console.log(projectData.Faculty1);

        if(formValidation())
        {
            // Update Project data in Firebase
            await update(projectRef, {
                Title: projectData.Title.trim(),
                Description: projectData.Description.trim(),
                Faculty: {"Faculty1": projectData.Faculty1,
                    "Faculty2": projectData.Faculty2},

                Technology: projectData.Technology.trim(),
                Database: projectData.Database.trim()
            })
            .then(() => {
                // alert("Project updated successfully!");
                MySwal.fire({
                    title: "Project updated successfully!",
                    icon: "success",
                    draggable: true
                });
            })
            .catch((error) => {
                alert("Error updating project !!");
                console.error("Error updating project: ", error);
            });

            console.log('Updated');
        }
        
        console.log(projectData);
    };

    // useEffect(()=>{
    //     const loadData = async ()=>{
    //         await axios.get(`http://127.0.0.1:8000/api/edit/${projectId}`)
    //         .then((response)=>{
    //             console.log(response.data);
    //             const project = Object.values(response.data);
    //             setProjectData(project);
    //         })
    //         .catch((error)=>{
    //             console.log(error);
    //         })
    //     };

    //     loadData();
        
    // }, [projectId])

    return (
        <>
            <div className="container mt-3">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                {
                    projectData === null ? (
                        <p>Loding Data</p>
                    ):(
                        <div className="card">
                            <div className="card-header">
                                <h5 className="my-auto">Edit Project : <span className="text-primary">{projectData.Title}</span></h5>
                            </div>
                            <div className="card-body">

                                <form onSubmit={formSubmit}>
                                    <div className="row form-group">
                                        <div className="col-lg-12">
                                            <label htmlFor="" className="my-2">Project Title</label>
                                            <input type="text" value={projectData.Title} onChange={inputData} placeholder="Project Title" name="Title" className={`form-control ${error.Title ? "is-invalid" : ""}`} />
                                            {error.Title && <p className="text-danger">{error.Title}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group my-2">
                                        <div className="col-lg-12">
                                            <label htmlFor="" className="my-2">Project Description</label>
                                            <input type="text" value={projectData.Description} onChange={inputData} placeholder="Project Description" name="Description" className={`form-control ${error.Description ? "is-invalid" : ""}`} />
                                            {error.Description && <p className="text-danger">{error.Description}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group my-2">
                                        <div className="col-lg-6">
                                            <label htmlFor="" className="mb-2">Faculty</label>
                                            <select required name="Faculty1" id="" onChange={inputData} className={`form-control ${error.Faculty1 ? "is-invalid" : ""}`}>
                                            
                                                {
                                                    projectData.Faculty1 ? (<option value={projectData.Faculty1}>{projectData.Faculty1}</option>)
                                                    : (<option value="">Select Faculty 1</option>)
                                                }
                                                {
                                                    facultyData && facultyData.map((item, index)=>(
                                                        <option key={index} value={item.id}>{item.FirstName} {item.LastName}</option>
                                                    ))
                                                }
                                            </select>
                                            {/* <input type="text" value={projectData.Technology}  placeholder="Project Technology" name="Technology"  /> */}
                                            {error.Faculty1 && <p className="text-danger">{error.Faculty1}</p>}
                                        </div>

                                        <div className="col-lg-6">
                                            <label htmlFor="" className="mb-2">Faculty 2</label>
                                            <select required name="Faculty2" id="" onChange={inputData} className={`form-control ${error.Faculty2 ? "is-invalid" : ""}`}>
                                                {
                                                    projectData.Faculty2 ? (<option value={projectData.Faculty2}>{projectData.Faculty2}</option>)
                                                    : (<option value="">Select Faculty 2</option>)
                                                }
                                                {
                                                    facultyData && facultyData.map((item, index)=>(
                                                        <option key={index} value={item.id}>{item.FirstName} {item.LastName}</option>
                                                    ))
                                                }
                                            </select>
                                            {/* <input type="text" value={projectData.Technology}  placeholder="Project Technology" name="Technology"  /> */}
                                            {error.Faculty2 && <p className="text-danger">{error.Faculty2}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group my-2">
                                        <div className="col-lg-6">
                                            <label htmlFor="" className="my-2">Technology</label>

                                            <select name="Technology" id="" onChange={inputData} className={`form-control ${error.Technology ? "is-invalid" : ""}`}>
                                                
                                                {
                                                    projectData.Technology ? (<option value={projectData.Technology}>{projectData.Technology}</option>)
                                                    : (<option value="">Select Technology</option>)
                                                }
                                                {
                                                    projectTechnology && projectTechnology.map((tech, index)=>(
                                                        <option key={index} value={tech.id}>{tech.technology}</option>
                                                    ))
                                                }
                                            </select>
                                            {/* <input type="text" value={projectData.Technology}  placeholder="Project Technology" name="Technology"  /> */}
                                            {error.Technology && <p className="text-danger">{error.Technology}</p>}
                                        </div>

                                        <div className="col-lg-6">
                                            <label htmlFor="" className="my-2">Database</label>
                                            <select name="Database" id="" onChange={inputData} className={`form-control ${error.Database ? "is-invalid" : ""}`}>

                                                
                                                {
                                                    projectData.Database ? (
                                                    <option value={projectData.Database ? projectData.Database : ""}>{projectData.Database ? projectData.Database : "Select Database"}</option>
                                                ) : (
                                                    <option value="">Select Database</option>
                                                )
                                                }
                                                    
                                                {                   
                                                    projectDatabase && projectDatabase.map((tech, index)=>(
                                                        <option key={index} value={tech.id}>{tech.database}</option>
                                                    ))
                                                }
                                            </select>
                                            {/* <input type="text" value={projectData.Database} onChange={inputData} placeholder="Project Database" name="Database" className={`form-control ${error.Database ? "is-invalid" : ""}`} /> */}
                                            {error.Database && <p className="text-danger">{error.Database}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group mt-3">
                                        <div className="col-lg-6">
                                            <button type="submit" className="btn btn-primary">Update Project</button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                        
                    )
                }

                    </div>
                </div>
            </div>
            
        </>
    );
}

export default EditProject