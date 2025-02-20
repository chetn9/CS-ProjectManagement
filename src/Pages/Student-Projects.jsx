import React from "react";

function StudentProjects() {
    return (
        <>
            <div className="container mt-3">
                
                <div className="row">
                    <div className="card p-0">
                        <div className="card-header">
                            <h5>Student Projects</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive-sm">

                            <table className="table table-bordered text-center text-nowrap">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Project Title</th>
                                        <th>Description</th>
                                        <th>Due Date</th>
                                        <th>Student ID</th>
                                        <th>Group ID</th>
                                        <th>Faculty 1</th>
                                        <th>Faculty 2</th>
                                        <th>Project Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody className="text-nowrap">
                                    <tr>
                                        <td>001</td>
                                        <td>E-Commerce</td>
                                        <td>Description for Project</td>
                                        <td>25-2-25</td>
                                        <td>1</td>
                                        <td>N/A</td>
                                        <td>2</td>
                                        <td>5</td>
                                        <td > <span className="badge badge-dark bg-info text-light"> On-Going </span></td>
                                       
                                        <td><a className="btn btn-primary" href="">Edit</a>
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

export default StudentProjects;