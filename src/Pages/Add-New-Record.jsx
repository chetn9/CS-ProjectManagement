import React, { useEffect, useState } from "react";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue, push, set } from "firebase/database";

// import { auth } from 'firebase';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import addImg from "../assets/icons/add_user_light_web_96.png";

const MySwal = withReactContent(Swal)

const auth = getAuth();

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

        if(userData.Role === "Admin")
        {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, userData.Email.trim(), userData.Password.trim());
                console.log('User created:', userCredential.user);
                const createdUser = userCredential.user;
                alert('Signup successful!');

                const dataRef = ref(database, 'users/'+createdUser.uid);

                await set(dataRef,{
                    // id: userCredential.user.uid,
                    FirstName: userData.FirstName.trim(),
                    LastName: userData.LastName.trim(),
                    Email: userData.Email.trim(),
                    Role: userData.Role,
                    Password: userData.Password.trim(),

            }).then(()=>{

                // alert("Record added successfully!");
                MySwal.fire({
                    title: "Record added successfully!",
                    icon: "success",
                    draggable: true
                });

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
              } catch (err) {
                console.error('Error signing up:', err);
                setError(err.message);
              }
        }

        if (userData.Role === "Faculty") 
        {
            try 
            {
                const userCredential = await createUserWithEmailAndPassword(auth, userData.Email.trim(), userData.Password.trim());
                console.log('User created:', userCredential.user);
                const createdUser = userCredential.user;
                alert('Signup successful!');

                await sendEmailVerification(createdUser);

                const dataRef = ref(database, 'users/' + createdUser.uid);

                await set(dataRef, {
                    id: userCredential.user.uid,
                    FirstName: userData.FirstName.trim(),
                    LastName: userData.LastName.trim(),
                    Email: userData.Email.trim(),
                    Role: userData.Role,
                    Password: userData.Password.trim(),
                }).then(() => {

                    // alert("Record added successfully!");
                    MySwal.fire({
                        title: "Record added successfully!",
                        icon: "success",
                        draggable: true
                    });

                    setUserData({
                        FirstName: "",
                        LastName: "",
                        Email: "",
                        Role: "",
                        Password: "",
                    });
                })
                    .catch((error) => {
                        console.error("Error: ", error.message);
                    });
            } catch (err) {
                console.error('Error signing up:', err);
                setError(err.message);
            }
        }
        
        if(formValidation())
        {
            if(userData.Role === "Student")
            {
                const dataRef = ref(database, 'users');
                push(dataRef,{
                        FirstName: userData.FirstName.trim(),
                        LastName: userData.LastName.trim(),
                        Email: userData.Email.trim(),
                        Role: userData.Role,
                        Password: userData.Password.trim(),
                }).then(()=>{
    
                    // alert("Record added successfully!");
                    MySwal.fire({
                        title: "Record added successfully!",
                        icon: "success",
                        draggable: true
                    });
    
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
    }

    return (
        <>
            <div className="container mt-3">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card overflow-hidden cardForRadius">
                            <div className="card-header bg-white border-0 text-dark p-3">
                                <div className="d-flex align-items-center projectCard">
                                    <img src={addImg} style={{background: "#1e90ff"}} alt="" />
                                    <h4 className="my-auto mx-3">Add New Record</h4>
                                </div>
                            </div>
                            
                            <div className="card-body">
                                <form onSubmit={submitForm}>

                                    <div className="row form-group ">
                                        <div className="col-lg-12">
                                            <label htmlFor="" className="mb-2">First Name</label>
                                            <input type="text" value={userData.FirstName} onChange={inputData} placeholder="First Name" name="FirstName" className={`form-control ${error.FirstName ? "is-invalid" : ""}`} />
                                            {error.FirstName && <p className="text-danger">{error.FirstName}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group mt-2">
                                        <div className="col-lg-12">
                                            <label htmlFor="" className="mb-2">Last Name</label>
                                            <input type="text" value={userData.LastName} onChange={inputData} placeholder="Last Name" name="LastName" className={`form-control ${error.LastName ? "is-invalid" : ""}`}  />
                                            {error.LastName && <p className="text-danger">{error.LastName}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group mt-2">
                                        <div className="col-lg-12">
                                            <label htmlFor="" className="mb-2">Email</label>
                                            <input type="text" value={userData.Email} onChange={inputData} placeholder="Email" name="Email" className={`form-control ${error.Email ? "is-invalid" : ""}`} />
                                            {error.Email && <p className="text-danger">{error.Email}</p>}
                                        </div>
                                    </div>

                                    <div className="row form-group mt-2">

                                        <div className="col-lg-6">
                                            <label htmlFor="" className="mb-2">Role</label>

                                            <select name="Role" value={userData.Role} onChange={inputData}  className={`form-control ${error.Role ? "is-invalid" : ""}`}>
                                                <option value="">Select Role</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Faculty">Faculty</option>
                                                <option value="Student">Student</option>
                                            </select>
                                            {error.Role && <p className="text-danger">{error.Role}</p>}
                                           
                                        </div>

                                        <div className="col-lg-6">
                                            <label htmlFor="" className="mb-2">Password</label>

                                            <input type="text" value={userData.Password} onChange={inputData} className={`form-control ${error.Password ? "is-invalid" : ""}`} name="Password"  />
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