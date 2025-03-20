import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import img1 from "../assets/project_management_4.webp";
import img2 from "../assets/Project-Management_6.png";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue } from "firebase/database";
import StudentProjects from "./Student-Projects";
import StudentList from "./Student-List";

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
                    <StudentList />
                </div>

                <div className="row mt-3">
                    <StudentProjects/>        
                </div>
            </div>
        </>
    );
}

export default Dashboard;