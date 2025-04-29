import { useEffect, useState } from "react"

import { database } from "../Firebase/firebase-config";
import { getDatabase, get, ref, onValue, remove, update, off } from "firebase/database";
import userImg from "../assets/icons/admin_user.png";
import { getAuth, updatePassword } from "firebase/auth";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ShimmerLoader from "../Components/ShimmerEffect";

function ProfilePage() {
    const MySwal = withReactContent(Swal);
    const userId = sessionStorage.getItem("user");
    const [userData, setUserData] = useState("");

    const auth = getAuth();

    useEffect(() => {
        const userDataRef = ref(database, `users/${userId}`);

        onValue(userDataRef, (snapshot) => {
            const data = snapshot.val();
            setUserData(data);
            console.log(snapshot.val());
        })
    }, [])

    const updatePsw = ()=>{
        const user = auth.currentUser;

        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if(newPassword === "" || confirmPassword === "")
        {
            MySwal.fire({
                title: "Please Enter Password!",
                icon: "warning",
                draggable: true
            });
        }
        else
        {
            if(newPassword === confirmPassword)
            {
                updatePassword(user, newPassword).then(()=>{
                    // alert("Password Updated Successfully");
                    document.getElementById("newPassword").value = "";
                    document.getElementById("confirmPassword").value = "";

                    MySwal.fire({
                        title: "Password Changed!",
                        icon: "success",
                        draggable: true
                    });
                })
                .catch((error)=>{
                    alert(error.message);
                    console.log(error);
                })
            }
            else
            {
                alert("Passwords do not match");
            }
        }
        // console.log(user);
        
    }

    return (
        <>
            <section className="">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-lg-8 mb-4 mb-lg-0">
                            {
                                userData === null ? (<ShimmerLoader/>):(
                                <div className="card cardForRadius mb-3" style={{ borderRadius: '.5rem' }}>
                                <div className="row g-0">
                                    <div
                                        className="col-md-4 gradient-custom text-center text-white"
                                        style={{
                                            borderTopLeftRadius: '.5rem',
                                            borderBottomLeftRadius: '.5rem'
                                        }}>
                                        <img
                                            src={userImg}
                                            alt="Avatar"
                                            className="img-fluid my-5"
                                            style={{ width: '80px' }}
                                        />
                                        <h5>{userData.FirstName + " " + userData.LastName}</h5>

                                        <i className="far fa-edit mb-5"></i>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="card-body p-4">
                                            <h6>Information</h6>
                                            <hr className="mt-0 mb-4" />
                                            <div className="row pt-1">
                                                <div className="col-6 mb-3">
                                                    <h6>Email</h6>
                                                    <p className="text-muted">{userData.Email}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Role</h6>
                                                    <p className="text-muted fw-bold">{userData.Role}</p>
                                                </div>
                                            </div>

                                            <hr className="mt-0 mb-4" />
                                        
                                            <div className="row pt-1">
                                                {/* <div className="col-6 mb-3">
                                                    <h6>Edit Profile</h6>
                                                    <button className="btn btn-primary btn-sm">Edit</button>
                                                </div> */}
                                                <div className="col-6 mb-3">
                                                    <h6>Change Password</h6>

                                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                       Edit
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-start">
                                                <a href="#!"><i className="fab fa-facebook-f fa-lg me-3"></i></a>
                                                <a href="#!"><i className="fab fa-twitter fa-lg me-3"></i></a>
                                                <a href="#!"><i className="fab fa-instagram fa-lg"></i></a>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                                )
                            }
                            
                        </div>
                    </div>
                </div>
            </section>

            <section>
               
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Change Password</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div className="row form-group">
                                    <div className="col-lg-12">

                                        <input type="text" name="" required  className="form-control" placeholder="Enter new Password" id="newPassword" />
                                    </div>

                                    <div className="col-lg-12 mt-3">
                                        <input type="text" name="" required className="form-control" placeholder="Confirm Password" id="confirmPassword" />
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" onClick={updatePsw} class="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProfilePage