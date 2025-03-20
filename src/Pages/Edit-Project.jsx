import React, { useEffect, useState } from "react";
import axios from "axios";
import { data, useParams } from "react-router-dom";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue, update } from "firebase/database";

function EditProject(){

    const {projectId} = useParams();

    const [error, setError] = useState({
        Title: "",
        Description: "",
        Technology: "",
        Database: ""
    });

    const [projectData, setProjectData] = useState({
        Title: "",
        Description: "",
        Technology: "",
        Database: ""
    });

    const [projectTechnology, setProjectTechnology] = useState(null);
    const [projectDatabase, setProjectDatabase] = useState("");
    const [techId, setTechId] = useState(null);

    // For loading Project with ID
    useEffect(()=>{
        const dataRef = ref(database, 'projects/data/'+projectId);

        onValue(dataRef, (snapshot)=>{
            const dataFromFirebase = snapshot.val();

            if(dataFromFirebase)
            {
                setProjectData({
                    Title: dataFromFirebase.Title,
                    Description: dataFromFirebase.Description,
                    Technology: dataFromFirebase.Technology,
                    Database: dataFromFirebase.Database
                });

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
        };
        
    }, [projectId]);

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

        if(formValidation())
        {
            // Update Project data in Firebase
            await update(projectRef, {
                Title: projectData.Title.trim(),
                Description: projectData.Description.trim(),
                Technology: projectData.Technology.trim(),
                Database: projectData.Database.trim()
            })
            .then(() => {
                alert("Project updated successfully!");
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
                <div className="row">
                    <div className="col-lg-6">
                {
                    projectData === null ? (
                        <p>Loding Data</p>
                    ):(
                        <div className="card">
                            <div className="card-header">
                                <h5 className="my-auto">Edit Project</h5>
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