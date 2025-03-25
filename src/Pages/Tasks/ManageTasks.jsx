import { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import { database } from "../../Firebase/firebase-config";
import { getDatabase, get, ref, onValue, remove, update, query, orderByChild, equalTo } from "firebase/database";
import ShimmerLoader from "../../Components/ShimmerEffect";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


function ManageTask()
{
    const MySwal = withReactContent(Swal);
    
    const {projectId} = useParams();
    const [taskList, setTaskList] = useState(null);
    // let table = new DataTable('#myTable');

    DataTable.use(DT);

    useEffect(()=>{
        const dataRef = ref(database, 'tasks');

        const dataQuery = query(dataRef, orderByChild("ProjectId"), equalTo(projectId));

        onValue(dataQuery, (snapshot)=>{
            if(snapshot.exists())
            {
                const taskData = snapshot.val();

                const taskArray = Object.entries(taskData).map(([id, task])=> ({
                    id,
                    ...task
                }));

                setTaskList(taskArray);
            }
        });

        return ()=>{
            setTaskList(null);
        }

    }, [projectId]);

    const inputData = (e)=>{

    }

    const formSubmit=(e)=>{

    }

    const deleteTask =(id)=>{

        const dataRef = ref(database, 'tasks/'+id);

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
                // console.log(dataRef);
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
            <div className="container-fluid mt-3 mb-3">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card border-dark">
                            <div className="card-header bg-dark text-light">
                                <h4 className="my-auto">Project Task List</h4>
                            </div>
                            <div className="card-body">
                                {
                                    taskList == null ? (
                                       <ShimmerLoader />
                                    ) : (

                                        <div className="table-responsive">

                                        <DataTable className="table text-center table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Status</th>
                                                    <th>Due Date</th>
                                                    <th>Assigned At</th>
                                                    <th>Updated At</th>
                                                    <th>Assigned By</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    taskList.map((item, index)=>(
                                                        <tr key={index}>
                                                            <td style={{width:"30%"}}>{item.Title}</td>
                                                            <td><span className={item.Status === "Pending" ? "badge text-dark bg-warning badge-warning" : (item.Status == "Completed" ? "badge bg-success badge-success" : "badge bg-info badge-info")}>{item.Status}</span></td>
                                                            <td className="text-nowrap">{item.due_date}</td>
                                                            <td>{item.AssignedAt ? item.AssignedAt : "-"}</td>
                                                            <td>{item.UpdatedAt}</td>
                                                            <td>{item.AssignedBy ? item.AssignedBy : "-" }</td>
                                                            <td className="text-nowrap">
                                                                <button data-bs-toggle="modal" data-bs-target="#exampleModal" data={item.id} className="btn btn-primary mx-auto" type="submit" onClick={()=>{e.preventDefault()}}>Edit</button>
                                                                <button className="mx-2 btn btn-danger mt-lg-0 mt-2" type="submit" onClick={()=>{deleteTask(item.id)}}>Delete</button>
                                                            </td>
                                                           
                                                        </tr>
                                                    ))
                                                }
                                                
                                            </tbody>
                                        </DataTable>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Task</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div className="modal-body">
                                    <form onSubmit={formSubmit}>
                                        <div className="row form-group">
                                            <div className="col-lg-12">
                                                <label htmlFor="" className="mb-2">Database</label>
                                                <input type="text" required onChange={inputData} className="form-control" name="dbName" id="" />
                                            </div>
                                        </div>

                                        <div className="row form-group mt-3">
                                            <div className="col-lg-6">
                                                <button type="submit" className="btn btn-primary">Save changes</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ManageTask;