import React, { useEffect, useState } from "react";
import img1 from "../assets/project_management_4.webp";
import img2 from "../assets/Project-Management_6.png";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue } from "firebase/database";

function Dashboard() {

    const [userData, setUserData] = useState(null);

    // For User-Records
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
                setUserData(studentData);

                console.log(studentData);
            }
            else
            {
                setUserData([]);
            }
          });
                
          return () => {
            setUserData(null);
          };

    }, []);

    return (
        <>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card">

                            <div className="card-body">
                                <h4>Total Students</h4>
                                <p>50</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card">

                            <div className="card-body">
                                <h4>Total Projects</h4>
                                {/* <img src={img2} className="img-fluid" style={{height:"100px"}} alt="" srcset="" /> */}
                                <p>50</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card">

                            <div className="card-body">
                                <h4>Completed Projects</h4>
                                <p>50</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                <div className="card p-0">
                        <div className="card-header">
                            <h5>Student Records</h5>
                        </div>

                        <div className="card-body">

                            {
                                userData === null ? (
                                    <p>Loading Data</p>
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
                                            userData.map((user)=>(
                                            
                                            
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.FirstName}</td>
                                                <td>{user.LastName}</td>
                                                <td>{user.Email}</td>
                                                <td>{user.Stream}</td>
                                                <td>{user.Semester}</td>
                                            
                                                <td><a className="btn btn-primary btn-sm" href="">Edit</a> | <a className="btn btn-danger btn-sm" href="">Delete</a>
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

export default Dashboard;