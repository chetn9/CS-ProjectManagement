import React from "react";

function AddNewRecord() {
    return (
        <>
            <div class="container mt-3">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card">
                            <div class="card-body">
                                <form>

                                    <div class="row form-group my-2">
                                        <div class="col-lg-12">
                                            <label for="">First Name</label>

                                            <input type="text" placeholder="First Name" name="fname" class="form-control" id="" />

                                        </div>
                                    </div>

                                    <div class="row form-group my-2">
                                        <div class="col-lg-12">
                                            <label for="">Last Name</label>
                                            <input type="text" placeholder="Last Name" name="lname" class="form-control" id="" />
                                           
                                        </div>
                                    </div>

                                    <div class="row form-group my-2">
                                        <div class="col-lg-12">
                                            <label for="">Email</label>
                                            <input type="text" placeholder="Email" name="email" class="form-control" id="" />
                                            
                                        </div>
                                    </div>

                                    <div class="row form-group my-2">

                                        <div class="col-lg-6">
                                            <label for="">Role</label>

                                            <select name="role" id="" class="form-control">
                                                <option value="">Select Role</option>
                                                <option value="Faculty">Faculty</option>
                                                <option value="Student">Student</option>
                                            </select>

                                           
                                        </div>

                                        <div class="col-lg-6 ">
                                            <label for="">Password</label>

                                            <input type="text" class="form-control" name="psw" id="" />
                                            
                                        </div>
                                    </div>

                                    <div class="row form-group mt-3">
                                        <div class="col-lg-6">
                                            <button type="submit" class="btn btn-primary">Add Record</button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}

export default AddNewRecord