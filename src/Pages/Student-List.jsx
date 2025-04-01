import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { Link } from "react-router-dom";
import LinkButton from "../Components/UpdateLinkButton";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ShimmerLoader from "../Components/ShimmerEffect";
import $ from 'jquery'; 
import DataTable from 'datatables.net-react';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

import DT from 'datatables.net-bs5';

import studentImg from "../assets/student_web_light_96.png";

DataTable.use(DT);

function StudentList() {
    // const data = ["Chetan", "Somaiya", "cs@gmail.com", "1"];
    
    const tableRef = useRef(null);
    const [studentData, setStudentData] = useState([]);
    const MySwal = withReactContent(Swal);
    
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

    // Fatching all Records
    const fetchStudentData = ()=>{
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
    }

    useEffect(() => {
        fetchStudentData();

        return () => {
            // Cleanup DataTable when the component is unmounted
            if ($.fn.dataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().clear().destroy();
            }
        };
    }, []);

    // Effect to handle when studentData changes
    useEffect(() => {
        if (studentData.length > 0 && tableRef.current) {
            // Initialize DataTable only after studentData is loaded
            $(tableRef.current).DataTable({
                destroy: true, // Ensure previous instance is destroyed
            });
        }
    }, [studentData]);

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
            <div className="container-fluid mt-3">
                
                <div className="row mx-1">
                    <div className="card border overflow-hidden p-0 cardForRadius">
                        <div className="card-header border-0 bg-white p-3">
                            <div className="d-flex projectCard">
                                <img src={studentImg} style={{background: "#1e90ff"}} alt="" />
                                <h3 className="mx-3 fw-bold mt-2" style={{color: "#2f3542", letterSpacing: 0.5, fontFamily: "sans-serif"}}>Student Records</h3>
                            </div>
                        </div>

                        <div className="card-body">

                            {
                                studentData == 0 || studentData == null ? (
                                    <ShimmerLoader />
                            ): (
                                    <div className="table-responsive-sm">

                                    <table ref={tableRef} id="myTable" className="display table table-bordered text-center text-nowrap">
                                        <thead>
                                            <tr>
                                                <th className="text-center">#</th>
                                                <th className="text-center">First Name</th>
                                                <th className="text-center">Last Name</th>
                                                <th className="text-center">Email</th>
                                                <th className="text-center">Stream</th>
                                                <th className="text-center">Semester</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-nowrap">
                                            {
                                            studentData.map((user, index)=>(
                                            
                                            
                                            <tr key={user.id}>
                                                <td className="text-center">{index+1}</td>
                                                <td className="text-center">{user.FirstName}</td>
                                                <td className="text-center">{user.LastName}</td>
                                                <td className="text-center">{user.Email}</td>
                                                <td className="text-center">{user.Stream}</td>
                                                <td className="text-center">{user.Semester}</td>
                                            
                                                <td className="text-center">
                                                <LinkButton to={`/Edit-Student/${user.id}`} className={"btn btn-outline-primary"} text={"Edit"}/>
                                                <span className="mx-2">|</span> 
                                                <button type="submit" className="ml-3 btn btn-outline-danger" onClick={()=>deleteRecord(user.id)}> Delete <i className="bi bi-x-circle-fill"></i></button>
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