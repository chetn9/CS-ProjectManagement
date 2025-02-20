import React from "react";
import img1 from "../assets/project_management_4.webp";
import img2 from "../assets/Project-Management_6.png";

function Dashboard() {
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
                                    <tr>
                                        <td>001</td>
                                        <td>Chetan</td>
                                        <td>Somaiya</td>
                                        <td>cs@gmail.com</td>
                                        <td>Msc</td>
                                        <td>1</td>
                                       
                                        <td><a className="btn btn-primary btn-sm" href="">Edit</a> | <a className="btn btn-danger btn-sm" href="">Delete</a>
                                        </td>
                                    </tr>
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

export default Dashboard;