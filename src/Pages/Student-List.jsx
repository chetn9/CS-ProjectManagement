import React from "react";

function StudentList() {
    return (
        <>
            <div className="container mt-3">
                
                <div className="row">
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

export default StudentList;