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
    const [countStudents, setCountStudents] = useState(0);
    const [countProjects, setCountProjects] = useState(0);
    const [countCompletedProject, setCountCompletedProject] = useState(0);

    // For User-Records
    useEffect(()=>{
    
        const dataRef = ref(database, 'users');

        onValue(dataRef, (snapshot) => {
            const dataFromFirebase = snapshot.val();

            if (dataFromFirebase) {
                const usersArray = Object.entries(dataFromFirebase).map(([id, user]) => ({
                    id,
                    ...user,
                }));

                const studentData = usersArray.filter((user) => user.Role === "Student");
                // setUserData(studentData);
                setCountStudents(studentData.length);

                // console.log(studentData);
            }
            else {
                setCountStudents(0);
            }
        });

        const projectRef = ref(database, 'projects/data');

        onValue(projectRef, (snapshot) => {
            const dataFromFirebase = snapshot.val();

            if (dataFromFirebase) {
                const projectArray = Object.entries(dataFromFirebase).map(([id, project]) => ({
                    id,
                    ...project,
                }));

                const totalProjects = projectArray.length;

                const completedProjectData = projectArray.filter((user) => user.ProjectStatus === "Completed");
                // setUserData(studentData);
                // console.log(completedProjectData);
                setCountCompletedProject(completedProjectData.length);
                setCountProjects(totalProjects)

                // console.log(studentData);
            }
            else {
                setCountCompletedProject(0);
            }
        });
                
          return () => {
            setUserData(null);
            // setCountStudents(null);
          };

    }, []);

    return (
        <>
            <div className="container">
                <div className="row">

                    <div className="col-lg-4 col-6">
                        <div className="card dashboardCard">
                            <div className="card-body projectCard">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className=" my-auto">Total Students</h4>
                                    <img src={capImg} className="my-auto img-fluid bg-info" alt="" />
                                </div>
                                <p>{countStudents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-6">
                        <div className="card dashboardCard">

                            <div className="card-body projectCard">
                                <div className="d-flex justify-content-between align-items-center">

                                    <h4 className="my-auto">Total Projects</h4>
                                    <img src={projectManagementImg} className="my-auto img-fluid bg-danger" alt="" />
                                {/* <img src={img2} className="img-fluid" style={{height:"100px"}} alt="" srcset="" /> */}
                                </div>

                                <p>{countProjects}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-6 mt-lg-0 mt-3 ">
                        <div className="card dashboardCard">

                            <div className="card-body projectCard">
                                <div className="d-flex justify-content-between align-items-center">


                                    <h4 className="my-1">Completed Projects</h4>

                                    <img src={completedImg} className="my-auto img-fluid" style={{ backgroundColor: "#05c46b" }} alt="" />
                                    
                                </div>
                                <p className="">{countCompletedProject}</p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-lg-3 col-6 mt-lg-0 mt-3 ">
                        <div className="card dashboardCard">

                            <div className="card-body projectCard">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="my-auto">Total Tasks</h4>
                                    <img src={taskListImg} alt="" style={{backgroundColor: "#1e90ff"}} />
                                </div>
                                <p>50</p>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* <div className="row mt-3">
                    <StudentList />
                </div> */}

                <div className="row mt-4">
                    <StudentProjects/>        
                </div>
            </div>
        </>
    );
}

export default Dashboard;