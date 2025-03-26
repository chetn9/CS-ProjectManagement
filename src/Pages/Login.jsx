import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Navigate, Router, Routes, useNavigate } from "react-router-dom";


const MySwal = withReactContent(Swal)

function Login({setIsAuthenticated})
{
    const auth = getAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        Email : "",
        Password: ""
    });

    const inputData = (e) =>{
        const {name, value} = e.target;

        setUserData((data)=>({
            ...data,
            [name]: value,
        }));
    }

    const formSubmit = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, userData.Email.trim(), userData.Password.trim())
        .then(async userCredential=>{
            const loggedInUser = userCredential.user;
            // alert('Login Success');
            const token = await loggedInUser.getIdToken();
            localStorage.setItem("userId", token);
            // setIsAuthenticated(true);
            navigate("/Dashboard");

            console.log(loggedInUser.uid);

        }).catch((error)=>{
          
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
            <div className="login">
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
                                            </div>

                                            <div className="row form-group mt-3">
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
                </div>
            </div>
        </>
    );
}

export default Login;