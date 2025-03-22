import axios from "axios";
import React, { useEffect, useState } from "react";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { Link } from "react-router-dom";
import LinkButton from "../Components/UpdateLinkButton";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ShimmerLoader from "../Components/ShimmerEffect";

const MySwal = withReactContent(Swal)

function StudentList() {
    // const data = ["Chetan", "Somaiya", "cs@gmail.com", "1"];

    const [studentData, setStudentData] = useState([]);

    // useEffect(() => {
    //     axios.get("http://127.0.0.1:8000/api/Student-Data")
    //     .then((response) => {
    //         const studentArray = Object.values(response.data);
    //         setStudentData(studentArray);
    //         console.log(response.data);
    //     }).catch((error)=>{
    //         console.log(error);
    //     });

    // },[]);

    useEffect(()=>{
        const dataRef = ref(database, 'users');

        onValue(dataRef, (snapshot) => {
            const dataFromFirebase = snapshot.val();

            if(dataFromFirebase)
            {
                const usersArray = Object.entries(dataFromFirebase).map(([id, user]) => ({
                    id,
                    ...user,
                }));

                const studentData = usersArray.filter((user) => user.Role === "Student");
                setStudentData(studentData);

                // console.log(studentData);
            }
            else
            {
                setStudentData([]);
            }
          });
                
          return () => {
            setStudentData(null);
          };

    }, []);

    const deleteRecord = (id)=>{
        const dataRef = ref(database, 'users/'+id);

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
            <div className="container mt-3">
                
                <div className="row">
                    <div className="card border border-dark p-0">
                        <div className="card-header bg-dark text-light">
                            <h5 className="my-auto fw-bold">Student Records</h5>
                        </div>

                        <div className="card-body">

                            {
                                studentData === null ? (
                                    <ShimmerLoader />
                            ): (
                                    <div className="table-responsive-sm">

                                    <table className="table table-bordered text-center text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Email</th>
                                                <th>Stream</th>
                                                <th>Semester</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-nowrap">
                                            {
                                            studentData.map((user, index)=>(
                                            
                                            
                                            <tr key={user.id}>
                                                <td>{index+1}</td>
                                                <td>{user.FirstName}</td>
                                                <td>{user.LastName}</td>
                                                <td>{user.Email}</td>
                                                <td>{user.Stream}</td>
                                                <td>{user.Semester}</td>
                                            
                                                <td>
                                                <LinkButton to={`/Edit-Student/${user.id}`} className={"btn btn-outline-primary"} text={"Edit"}/>
                                                <span className="mx-2">|</span> 
                                                <button type="submit" className="ml-3 btn btn-outline-danger" onClick={()=>deleteRecord(user.id)}> Delete <i class="bi bi-x-circle-fill"></i></button>
                                                </td>
                                            </tr>
                                            ))}                                    
                                            
                                        </tbody>
                                    </table>
                                    </div>
                            )}
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentList;