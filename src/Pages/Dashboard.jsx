import React from "react";

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
                            <table className="table text-center">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Semester</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Dashboard;