import { useState } from "react";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Navigate, Router, Routes, useNavigate } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { database } from "../Firebase/firebase-config";

const MySwal = withReactContent(Swal)

function Login({ setIsAuthenticated }) {
    const auth = getAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        Email: "",
        Password: ""
    });

    const inputData = (e) => {
        const { name, value } = e.target;

        setUserData((data) => ({
            ...data,
            [name]: value,
        }));
    }

    const updatePsw = async ()=>{
        const user = auth.currentUser;

        const email = document.getElementById("email").value;
        
        if(email === "" )
        {
            MySwal.fire({
                title: "Please Enter Email!",
                icon: "warning",
                draggable: true
            });
        }
        else
        {
            await sendPasswordResetEmail(auth, email).then(()=>{
                // alert("Password Updated Successfully");
                document.getElementById("email").value = "";

                MySwal.fire({
                    title: "Email Sent!",
                    icon: "success",
                    draggable: true
                });
            })
            .catch((error)=>{
                alert(error.message);
                console.log(error);
            })
            
        }
        // console.log(user);
        
    }

    // Login Form
    const formSubmit = (e) => {
        e.preventDefault();

        if (userData.Email === "" || userData.Password === "") 
        {
            MySwal.fire({
                title: "Enter Email or Password!",
                icon: "warning",
                draggable: true
            });

            return;
        }
        
        signInWithEmailAndPassword(auth, userData.Email.trim(), userData.Password.trim())
            .then(async userCredential => {
                const loggedInUser = userCredential.user;
                console.log(loggedInUser.emailVerified);
                // alert('Login Success');
                const token = await loggedInUser.getIdToken();
                // localStorage.setItem("userId", token);

                // setIsAuthenticated(true);

                const getAdminData = ref(database, `users/${loggedInUser.uid}`);

                onValue(getAdminData, (snapshot) => {
                    const data = snapshot.val();
                    // console.log(data);

                    if (data.Role === "Admin") {
                        sessionStorage.setItem("userId", token);
                        sessionStorage.setItem("user", loggedInUser.uid);
                        // setIsAuthenticated(true);
                        navigate("/");
                    }
                    else {
                        MySwal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "You are not authorized to access this page!",
                        });
                        navigate("/Login");
                    }
                })
                // navigate("/");

                console.log(loggedInUser.uid);

            }).catch((error) => {

                MySwal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Login Failed!",
                });
                console.error("Error: ", error.message);
            });

        console.log(userData);
    }

    return (
        <>
            <div className="login main_body">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="p-4">
                                <div className="card">

                                    <div className="card-body">
                                        <h4 className="mb-3">Login Page</h4>
                                        <form onSubmit={formSubmit}>
                                            <div className="row form-group">
                                                <div className="col-lg-12">
                                                    <label htmlFor="" className="mb-2"><i className="bi bi-envelope"></i> Email</label>
                                                    <input type="text" value={userData.Email} onChange={inputData} placeholder="Enter Email" name="Email" className="form-control" />
                                                </div>
                                            </div>

                                            <div className="row form-group mt-2">
                                                <div className="col-lg-12">
                                                    <label htmlFor="" className="mb-2"><i className="bi bi-lock"></i> Password</label>
                                                    <input type="password" value={userData.Password} onChange={inputData} placeholder="**********" name="Password" className="form-control" />
                                                </div>

                                                <p className="text-end mt-2" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{cursor: "pointer"}}>Forgot Password?</p>
                                            </div>

                                            <div className="row form-group mt-2">
                                                <div className="col-lg-12">
                                                    <button type="submit" className="btn btn-primary">Login</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">

                        <section>

                            <div class="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="exampleModalLabel">Forgot Password</h1>
                                            {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                                        </div>
                                        <div class="modal-body">
                                            <div className="row form-group">
                                                <div className="col-lg-12">
                                                    <input type="email" name="" required className="form-control" placeholder="Enter Email" id="email" />
                                                </div>

                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            
                                            <button type="button" onClick={updatePsw} class="btn btn-primary">Save changes</button>
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;