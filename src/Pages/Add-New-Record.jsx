import React, { useEffect, useState } from "react";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue, push } from "firebase/database";

function AddNewRecord() {

    const [userData, setUserData] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        Role: "",
        Password: "",
    });
    const [error, setError] = useState({});

    const formValidation = ()=>{

        let formValid = true;
        let storeErrors = {};

        Object.keys(userData).forEach((field) => {
            if (!userData[field] || userData[field].trim() === "" || userData[field] === null) {
                storeErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                formValid = false;
            }
        });

        setError(storeErrors);

        return formValid
    }

    const inputData = (e)=>{
        const {name, value} = e.target;

        setUserData((prevData)=>({
            ...prevData,
            [name]: value,
        }));
    };

    const submitForm = async (e) => {
        e.preventDefault();

        const dataRef = ref(database, 'users');

        if(formValidation())
        {
            push(dataRef,{
                    FirstName: userData.FirstName.trim(),
                    LastName: userData.LastName.trim(),
                    Email: userData.Email.trim(),
                    Role: userData.Role,
                    Password: userData.Password.trim(),
            }).then(()=>{

                alert("Record added successfully!");
                setUserData({
                    FirstName: "",
                    LastName: "",
                    Email: "",
                    Role: "",
                    Password: "",
                });                
            })
            .catch((error)=>{
                console.error("Error: ", error.message);
            });
        }
    }

    return (
        <>
            <div className="container mt-3">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="my-auto">Add New Record</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={submitForm}>

                                    <div className="row form-group ">
                                        <div className="col-lg-12">
                                            <label for="" className="mb-2">First Name</label>
                                            <input type="text" value={userData.FirstName} onChange={inputData} placeholder="First Name" name="FirstName" className={`form-control ${error.FirstName ? "is-invalid" : ""}`} id="" />
                                            {error.FirstName && <p className="text-danger">{error.FirstName}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group mt-2">
                                        <div className="col-lg-12">
                                            <label for="" className="mb-2">Last Name</label>
                                            <input type="text" value={userData.LastName} onChange={inputData} placeholder="Last Name" name="LastName" className={`form-control ${error.LastName ? "is-invalid" : ""}`} id="" />
                                            {error.LastName && <p className="text-danger">{error.LastName}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group mt-2">
                                        <div className="col-lg-12">
                                            <label for="" className="mb-2">Email</label>
                                            <input type="text" value={userData.Email} onChange={inputData} placeholder="Email" name="Email" className={`form-control ${error.Email ? "is-invalid" : ""}`} id="" />
                                            {error.Email && <p className="text-danger">{error.Email}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group mt-2">

                                        <div className="col-lg-6">
                                            <label for="" className="mb-2">Role</label>

                                            <select name="Role" value={userData.Role} onChange={inputData} id="" className={`form-control ${error.Role ? "is-invalid" : ""}`}>
                                                <option value="">Select Role</option>
                                                <option value="Faculty">Faculty</option>
                                                <option value="Student">Student</option>
                                            </select>
                                            {error.Role && <p className="text-danger">{error.Role}</p>}
                                           
                                        </div>

                                        <div className="col-lg-6">
                                            <label for="" className="mb-2">Password</label>

                                            <input type="text" value={userData.Password} onChange={inputData} className={`form-control ${error.Password ? "is-invalid" : ""}`} name="Password" id="" />
                                            {error.Password && <p className="text-danger">{error.Password}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group mt-3">
                                        <div className="col-lg-6">
                                            <button type="submit" className="btn btn-primary">Add Record</button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}

export default AddNewRecord