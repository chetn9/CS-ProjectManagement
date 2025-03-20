import React, { useEffect, useState } from "react";
import { database } from "../Firebase/firebase-config";
import { getDatabase, ref, onValue } from "firebase/database";

function AddNewRecord() {

    const [userData, setUserData] = useState(null);

    useEffect(()=>{
        const dataRef = ref(database, 'users');

        console.log(dataRef);

        onValue(dataRef, (snapshot) => {
            const dataFromFirebase = snapshot.val();
            setUserData(dataFromFirebase);
          });
                
          return () => {
            setUserData(null);
          };

    }, []);

    useEffect(() => {
        if (userData !== null) {
          console.log("Updated UserData", userData);
        }
      }, [userData]);

    function addData()
    {
        alert('Added');
    }

    const submitForm = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={submitForm}>

                                    <div className="row form-group my-2">
                                        <div className="col-lg-12">
                                            <label for="">First Name</label>

                                            <input type="text" placeholder="First Name" name="fname" className="form-control" id="" />

                                        </div>
                                    </div>

                                    <div className="row form-group my-2">
                                        <div className="col-lg-12">
                                            <label for="">Last Name</label>
                                            <input type="text" placeholder="Last Name" name="lname" className="form-control" id="" />
                                           
                                        </div>
                                    </div>

                                    <div className="row form-group my-2">
                                        <div className="col-lg-12">
                                            <label for="">Email</label>
                                            <input type="text" placeholder="Email" name="email" className="form-control" id="" />
                                            
                                        </div>
                                    </div>

                                    <div className="row form-group my-2">

                                        <div className="col-lg-6">
                                            <label for="">Role</label>

                                            <select name="role" id="" className="form-control">
                                                <option value="">Select Role</option>
                                                <option value="Faculty">Faculty</option>
                                                <option value="Student">Student</option>
                                            </select>

                                           
                                        </div>

                                        <div className="col-lg-6 ">
                                            <label for="">Password</label>

                                            <input type="text" className="form-control" name="psw" id="" />
                                            
                                        </div>
                                    </div>

                                    <div className="row form-group mt-3">
                                        <div className="col-lg-6">
                                            <button type="submit" onClick={addData} className="btn btn-primary">Add Record</button>
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