import { useEffect, useState, useRef } from "react";
import { data, useParams } from "react-router-dom";
import { database } from "../../Firebase/firebase-config";
import { getDatabase, get, ref, onValue, remove, update, query, orderByChild, equalTo } from "firebase/database";
import ShimmerLoader from "../../Components/ShimmerEffect";
import $ from 'jquery';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

DataTable.use(DT);
function ManageTask()
{
    const MySwal = withReactContent(Swal);

    const tableRef = useRef(null);

    const {projectId} = useParams();
    const [taskList, setTaskList] = useState([]);
    // let table = new DataTable('#myTable');

    const fetchTasks = ()=>{
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

        // return ()=>{
        //     setTaskList(null);
        // }
    }

    useEffect(() => {
        if(projectId)
        {
            fetchTasks();
        }

        return () => {
            // Cleanup DataTable when the component is unmounted
            if ($.fn.dataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().clear().destroy();
            }
        };

    }, [projectId]);

    // Effect to handle when studentData changes
    useEffect(() => {

        if (taskList.length > 0 && tableRef.current) {
            // Initialize DataTable only after studentData is loaded
            const table = $(tableRef.current).DataTable({
                destroy: true, // Ensure previous instance is destroyed
                paging: true,  // Enable paging
                searching: true, // Enable searching
                ordering: true, 
            });
            

            // table.clear().rows.add(taskList).draw();
        }
    }, [taskList]);


    const inputData = (e)=>{

    }

    const formSubmit=(e)=>{

    }

    const deleteTask =(id)=>{

        const dataRef = ref(database, 'tasks/'+id);

        if(dataRef != null)
        {
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
                    remove(dataRef).then(()=>{
                        fetchTasks();
                    }).catch((error)=>{

                        console.log(error);
                    });
                    MySwal.fire({
                    title: "Deleted! ",
                    text: "Record has been deleted.",
                    icon: "success"
                  });
                }
            });
        }
        else
        {
            MySwal.fire({
                title: "Warning! ",
                text: "Title data not found Refresh the Page",
                icon: "close"});
        }


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
                                    taskList.length < 0 ? (
                                       <ShimmerLoader />
                                    ) : (

                                        <div className="table-responsive">
                                            <table ref={tableRef} className="table text-center table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th className="text-center">Title</th>
                                                        <th className="text-center">Status</th>
                                                        <th className="text-center">Due Date</th>
                                                        <th className="text-center">Assigned At</th>
                                                        <th className="text-center">Updated At</th>
                                                        <th className="text-center">Assigned By</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        taskList.map((item, index)=>(
                                                            <tr key={index}>
                                                                <td className="text-center">{index+1}</td>
                                                                <td className="text-center" style={{width:"30%"}}>{item.Title}</td>
                                                                <td className="text-center"><span className={item.Status === "Pending" ? "badge text-dark bg-warning badge-warning" : (item.Status == "Completed" ? "badge bg-success badge-success" : "badge bg-info badge-info")}>{item.Status}</span></td>
                                                                <td className="text-nowrap">{item.due_date}</td>
                                                                <td className="text-center">{item.AssignedAt ? item.AssignedAt : "-"}</td>
                                                                <td className="text-center">{item.UpdatedAt ? item.UpdatedAt : "-"}</td>
                                                                <td className="text-center">{item.AssignedBy ? item.AssignedBy : "-" }</td>
                                                                <td className="text-nowrap">
                                                                    <button data-bs-toggle="modal" data-bs-target="#exampleModal" data={item.id} className="btn btn-primary mx-auto" type="submit" onClick={()=>{e.preventDefault()}}>Edit</button>
                                                                    <button className="mx-2 btn btn-danger mt-lg-0 mt-2" type="submit" onClick={()=>{deleteTask(item.id)}}>Delete</button>
                                                                </td>
                                                            
                                                            </tr>
                                                        ))
                                                    }
                                                    
                                                </tbody>
                                            </table>
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