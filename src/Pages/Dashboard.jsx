import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import img1 from "../assets/project_management_4.webp";
import img2 from "../assets/Project-Management_6.png";
import projectManagementImg from "../assets/project_management_for_Web_light_96.png"
import capImg from "../assets/cap_web_light_96.png"
import completedImg from "../assets/checkmark_web_light_96.png"
import taskListImg from "../assets/checklist_web_light_96.png"

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

                    <div className="col-lg-3">
                        <div className="card dashboardCard">

                            <div className="card-body projectCard">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className=" my-auto">Total Students</h4>
                                    <img src={capImg} className="bg-info" alt="" />
                                </div>
                                <p>50</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3">
                        <div className="card dashboardCard">

                            <div className="card-body projectCard">
                                <div className="d-flex justify-content-between align-items-center">

                                    <h4 className="my-auto">Total Projects</h4>
                                    <img src={projectManagementImg} className="img-fluid bg-danger" alt="" />
                                {/* <img src={img2} className="img-fluid" style={{height:"100px"}} alt="" srcset="" /> */}
                                </div>

                                <p>50</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3">
                        <div className="card dashboardCard">

                            <div className="card-body projectCard">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="my-auto">Completed Projects</h4>

                                    <img src={completedImg} style={{backgroundColor: "#00b894"}} alt="" />
                                    
                                </div>
                                <p>50</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3">
                        <div className="card dashboardCard">

                            <div className="card-body projectCard">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4>Total Tasks</h4>
                                    <img src={taskListImg} alt="" style={{backgroundColor: "#1e90ff"}} />
                                </div>
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