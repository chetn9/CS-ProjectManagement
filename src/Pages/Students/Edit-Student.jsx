import React, { useEffect, useState } from "react";

import { data, useParams } from "react-router-dom";
import { database } from "../../Firebase/firebase-config";
import { getDatabase, ref, onValue, update } from "firebase/database";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function EditProject(){

    const {studentId} = useParams();

    const [error, setError] = useState({});
    const [streamData, setStreamData] = useState(null);

    const [studentData, setStudentData] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        Stream: "",
        Semester: "",
    });

    // For loading Student Data with ID
    useEffect(()=>{
        const dataRef = ref(database, 'users/'+studentId);

        onValue(dataRef, (snapshot)=>{
            const dataFromFirebase = snapshot.val();

            if(dataFromFirebase)
            {
                setStudentData({
                    FirstName: dataFromFirebase.FirstName,
                    LastName: dataFromFirebase.LastName,
                    Email: dataFromFirebase.Email,
                    Stream: dataFromFirebase.Stream,
                    Semester: dataFromFirebase.Semester
                });

                console.log("Student ID", dataFromFirebase.id);
            }
            else
            {
                setStudentData({});
            }
        });

        return () => {
            setStudentData({
                FirstName: "",
                LastName: "",
                Email: "",
                Stream: "",
                Semester: "",
            });
        };
        
    }, [studentId]);

    useEffect(()=>{
        const dataRef = ref(database, 'streams');

        onValue(dataRef, (snapshot)=>{
            const streams = snapshot.val();

            if(streams)
            {
                const streamArray = Object.entries(streams).map(([id, stream]) => ({
                    id,
                    ...stream,
                }));

                setStreamData(streamArray);
            }
            else
            {
                setStreamData([]);
            }
        });

        return ()=>{
            setStreamData(null);
        };
    }, [])

    const inputData = (e)=> {
        const {name, value} = e.target;

        setStudentData((prevData)=>({
            ...prevData,
            [name]: value,
        }));
    };

    const formValidation = ()=>{

        let formValid = true;
        let storeErrors = {};

        Object.keys(studentData).forEach((field) => {
            if (!studentData[field] || studentData[field].trim() === "" || studentData[field] === null) {
                storeErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                formValid = false;
            }
        });

        setError(storeErrors);

        return formValid
    }

    const formSubmit = async (e)=> {
        e.preventDefault();

        const dataRef = ref(database, 'users/'+studentId);

        if(formValidation())
        {
            // Update Student data in Firebase

            const updatedStudent = {
                FirstName: studentData.FirstName.trim(),
                LastName: studentData.LastName.trim(),
                Email: studentData.Email.trim(),
                Stream: studentData.Stream,
                Semester: studentData.Semester
            };
    
            if(!updatedStudent.Stream)
            {
                studentData.Stream;
            }
            else if(!updatedStudent.Semester)
            {
                studentData.Semester ;
            }
            await update(dataRef, updatedStudent)
            .then(() => {
                // alert("Data updated successfully!");
                MySwal.fire({
                    title: "Data updated successfully!",
                    icon: "success",
                    draggable: true
                });
            })
            .catch((error) => {
                alert("Error updating Data !!");
                console.error("Error updating Data: ", error);
            });
        }

        console.log(studentData);
    };

    return (
        <>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-lg-6">
                {
                    studentData === null ? (
                        <p>Loding Data</p>
                    ):(
                        <div className="card">
                            <div className="card-header">
                                <h5 className="my-auto">Edit Student Data</h5>
                            </div>
                            <div className="card-body">

                                <form onSubmit={formSubmit}>
                                    <div className="row form-group">
                                        <div className="col-lg-12">
                                            <label htmlFor="" className="my-2">First Name</label>
                                            <input type="text" value={studentData.FirstName} onChange={inputData} placeholder="First Name" name="FirstName" className={`form-control ${error.FirstName ? "is-invalid" : ""}`} />
                                            {error.FirstName && <p className="text-danger">{error.FirstName}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group my-2">
                                        <div className="col-lg-12">
                                            <label htmlFor="" className="my-2">Last Name</label>
                                            <input type="text" value={studentData.LastName} onChange={inputData} placeholder="Last Name" name="LastName" className={`form-control ${error.LastName ? "is-invalid" : ""}`} />
                                            {error.LastName && <p className="text-danger">{error.LastName}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group my-2">
                                        <div className="col-lg-12">
                                            <label htmlFor="" className="my-2">Email</label>
                                            <input type="text" value={studentData.Email} onChange={inputData} placeholder="Email" name="Email" className={`form-control ${error.Email ? "is-invalid" : ""}`} />
                                            {error.Email && <p className="text-danger">{error.Email}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group my-2">
                                        <div className="col-lg-6">
                                            <label htmlFor="" className="my-2">Stream</label>

                                            <select name="Stream" onChange={inputData} id="" className={`form-control ${error.Stream ? "is-invalid" : ""}`}>
                                                {
                                                    studentData.Stream ? (
                                                        <option value={studentData.Stream}>{studentData.Stream}</option>
                                                    ) : (<option value="">Select Stream</option>)
                                                }
                                                {
                                                    streamData && streamData.map((stream)=>(
                                                        <option key={stream.id} value={stream.id}>{stream.stream}</option>
                                                    ))
                                                }
                                            </select>
                                            {/* <input type="text" value={studentData.Stream}  placeholder="Stream" name="Stream"  /> */}
                                            {error.Stream && <p className="text-danger">{error.Stream}</p>}
                                        </div>

                                        <div className="col-lg-6">
                                            <label htmlFor="" className="my-2">Semester</label>
                                            <input type="text" value={studentData.Semester} onChange={inputData} placeholder="Semester" name="Semester" className={`form-control ${error.Semester ? "is-invalid" : ""}`} />
                                            {error.Semester && <p className="text-danger">{error.Semester}</p>}
                                        </div>

                                    </div>

                                    <div className="row form-group mt-3">
                                        <div className="col-lg-6">
                                            <button type="submit" className="btn btn-primary">Update Record</button>
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