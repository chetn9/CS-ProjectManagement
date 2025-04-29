import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue, remove, off } from "firebase/database";
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

function FacultyList() {
    // const data = ["Chetan", "Somaiya", "cs@gmail.com", "1"];
    
    const tableRef = useRef(null);
    const [facultyData, setFacultyData] = useState([]);
    const MySwal = withReactContent(Swal);
    

    // Fatching all Records
    const fetchFacultyData = ()=>{
        const dataRef = ref(database, 'users');

        onValue(dataRef, (snapshot) => {
            const dataFromFirebase = snapshot.val();

            if(dataFromFirebase)
            {
                const usersArray = Object.entries(dataFromFirebase).map(([id, user]) => ({
                    id,
                    ...user,
                }));

                const studentData = usersArray.filter((user) => user.Role === "Faculty");
                setFacultyData(studentData);
            }
            else
            {
                setFacultyData([]);
            }
        }); 
        
        return ()=>{
            off(dataRef);
        }
    }


    // Unmount Faculty Data
    useEffect(()=>{
        const data = fetchFacultyData();

        return ()=>{
            setFacultyData([]);
            data();
            console.log("Unmount Faculty");
        }
    }, []);


    // DataTable
    useEffect(() => {
        fetchFacultyData();

        return () => {
            // Cleanup DataTable when the component is unmounted
            if ($.fn.dataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().clear().destroy();
            }
        };
    }, []);

    // Effect to handle when studentData changes
    useEffect(() => {
        if (facultyData.length > 0 && tableRef.current) {
            // Initialize DataTable only after studentData is loaded
            $(tableRef.current).DataTable({
                destroy: true, // Ensure previous instance is destroyed
            });
        }
    }, [facultyData]);

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
            <div className="container-fluid">
                
                <div className="row mx-1">
                    <div className="card border overflow-hidden p-0 cardForRadius">
                        <div className="card-header border-0 bg-white p-3">
                            <div className="d-flex projectCard">
                                <img src={studentImg} style={{background: "#1e90ff"}} alt="" />
                                <h3 className="mx-3 fw-bold mt-2" style={{color: "#2f3542", letterSpacing: 0.5, fontFamily: "sans-serif"}}>Faculty Records</h3>
                            </div>
                        </div>

                        <div className="card-body">

                            {
                                facultyData == 0 || facultyData == null ? (
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
                                            
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-nowrap">
                                            {
                                            facultyData.map((user, index)=>(
                                            
                                            
                                            <tr key={user.id}>
                                                <td className="text-center">{index+1}</td>
                                                <td className="text-center">{user.FirstName}</td>
                                                <td className="text-center">{user.LastName}</td>
                                                <td className="text-center">{user.Email} </td>
                                            
                                                <td className="text-center">
                                                {/* <LinkButton to={`/Edit-Student/${user.id}`} className={"btn btn-outline-primary"} text={"Edit"}/> */}
                                                {/* <span className="mx-2">|</span>  */}
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

export default FacultyList;