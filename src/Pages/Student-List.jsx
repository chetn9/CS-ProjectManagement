import axios from "axios";
import React, { useEffect, useState } from "react";

function StudentList() {
    // const data = ["Chetan", "Somaiya", "cs@gmail.com", "1"];

    const [studentData, setStudentData] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/Student-Data")
        .then((response) => {
            const studentArray = Object.values(response.data);
            setStudentData(studentArray);
            console.log(response.data);
        }).catch((error)=>{
            console.log(error);
        });

    },[]);

    return (
        <>
            <div className="container mt-3">
                
                <div className="row">
                    <div className="card p-0">
                        <div className="card-header">
                            <h5>Student Records</h5>
                        </div>
                        <div className="card-body">
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
                                    {studentData.map((item, index)=>(

                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{item.FirstName}</td>
                                            <td>{item.LastName}</td>
                                            <td>{item.Email}</td>
                                            <td>{item.Stream}</td>
                                            <td>{item.Semester}</td>
                                        
                                            <td><a className="btn btn-primary btn-sm" href="">Edit</a> | <a className="btn btn-danger btn-sm" href="">Delete</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default StudentList;