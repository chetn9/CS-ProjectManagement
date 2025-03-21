import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function Login()
{
    const auth = getAuth();

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

        signInWithEmailAndPassword(auth, userData.Email, userData.Password)
        .then(userCredential=>{
            const loggedInUser = userCredential.user;
            alert('Login Success');

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
                                                    <input type="text" value={userData.Password} onChange={inputData} placeholder="**********" name="Password" className="form-control" />
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