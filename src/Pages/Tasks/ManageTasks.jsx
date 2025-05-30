import { useEffect, useState, useRef } from "react";
import { data, useParams } from "react-router-dom";
import { database } from "../../Firebase/firebase-config";
import { getDatabase, get, ref, onValue, remove, update, query, orderByChild, equalTo, off } from "firebase/database";
import ShimmerLoader from "../../Components/ShimmerEffect";
import $ from 'jquery';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import taskImg from "../../assets/checklist_web_light_96.png"

DataTable.use(DT);
function ManageTask()
{
    const MySwal = withReactContent(Swal);

    const tableRef = useRef(null);

    const {projectId} = useParams();

    const [taskList, setTaskList] = useState([]);
    const [noTask, setNoTask] = useState(false);
    const [displayTask, setDisplayTask] = useState("");
    const [editTask, setEditTask] = useState({
        "id": "",
        "title": "",
        "desc": "",
        "due_date": "",
    })

    // let table = new DataTable('#myTable');

    const fetchTasks = ()=>{// Fetching task according to ProjectID
        const dataRef = ref(database, `projects/data/${projectId}/tasks`);

        // const dataQuery = query(dataRef, orderByChild("ProjectId"), equalTo(projectId));

        onValue(dataRef, (snapshot)=>{
            if(snapshot.exists())
            {
                const taskData = snapshot.val();

                const taskArray = Object.entries(taskData).map(([id, task])=> ({
                    id,
                    ...task
                }));

                setTaskList(taskArray);
                console.log(taskArray.length);
            }
            else
            {
                setNoTask(true);
            }
        });

        return ()=>{
            off(dataRef);
        };
    }

    useEffect(()=>{
        const data = fetchTasks();

        return ()=>{
            setTaskList([]);
            data();
            console.log("Unmount firebase");
        }
    }, []);

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

            setNoTask(false);
            console.log("Unmount DataTable");
        };

    }, [projectId]);

    useEffect(()=>{
        console.log("Workes when task changes");
        // console.log(taskList);
        
    }, [taskList]);

    // Effect to handle when taskData changes
    useEffect(() => {
       
        if (taskList.length > 0 || taskList == null && tableRef.current) {
            // Initialize DataTable only after studentData is loaded
            const table = $(tableRef.current).DataTable({
                destroy: true, // Ensure previous instance is destroyed
                paging: true,  // Enable paging
                searching: true, // Enable searching
                ordering: true,
        });

            // tableRef.current = table;

            // Manually trigger redraw (important when data is updated)
            // table.clear().rows.add(taskList).draw();
            
            // table.clear().rows.add(taskList).draw();
        }
    }, [taskList]);

    // Show Tasks in Form
    const showEditTask = (id)=>{
        const dataRef = ref(database, `projects/data/${projectId}/tasks/${id}`);

        get(dataRef).then((snapshot)=>{
            if(snapshot.exists())
            {
                const taskData = snapshot.val();
                setEditTask({
                    id: snapshot.key,
                    title: taskData.Title,
                    desc: taskData.Description,
                    due_date: taskData.due_date,
                });
                console.log(taskData);
            }
            else
            {
                MySwal.fire({
                    title: "Warning! ",
                    text: "Title data not found Refresh the Page",
                    icon: "close"
                });
            }
        }).catch((error)=>{
            console.log("Error in catch", error);
        });
    }

    // Display Task Details
    const showTask = (id) => {
        const dataRef = ref(database, `projects/data/${projectId}/tasks/${id}`);

        get(dataRef).then((snapshot)=>{
            if(snapshot.exists())
            {
                const taskData = snapshot.val();
                setDisplayTask(taskData);
                console.log(taskData);
            }
            else
            {
                MySwal.fire({
                    title: "Warning! ",
                    text: "Title data not found Refresh the Page",
                    icon: "close"
                });
            }
        }).catch((error)=>{
            console.log("Error in catch", error);
        });
    }

    const inputData = (e)=>{
        const {name, value} = e.target;
        setEditTask((prevData)=>({
            ...prevData,
            [name]: value
        }));
        // console.log(editTask);
    }

    const updateTask = (e)=>{
        // console.log(e);
        const dataRef = ref(database, `projects/data/${projectId}/tasks/${e}`);

        if(dataRef != null)
        {
            update(dataRef, {
                Title: editTask.title,
                Description: editTask.desc,
                due_date: editTask.due_date,
            }).then(()=>{
                MySwal.fire({
                    title: "Updated! ",
                    text: "Record has been updated.",
                    icon: "success"
                });
            }).catch((error)=>{
                console.log("Error in catch", error);
            });
        }
        else
        {
            MySwal.fire({
                title: "Warning! ",
                text: "Title data not found Refresh the Page",
                icon: "close"
            });
        }
       
    }
    const formSubmit=(e)=>{
        e.preventDefault();
    }

    const deleteTask =(id)=>{

        const dataRef = ref(database, `projects/data/${projectId}/tasks/${id}`)

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
                        // fetchTasks();
                        // setTaskList((prevTasks) => prevTasks.filter(task => task.id !== id));
                    }).catch((error)=>{
                        console.log("Error in catch",error);
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
                icon: "close"
            });
        }

    }

    return (
        <>
            <div className="container-fluid mb-3">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card overflow-hidden cardForRadius">
                            <div className="card-header bg-white border-0 text-dark p-3">
                                <div className="d-flex align-items-center projectCard">
                                    <img src={taskImg} style={{background: "#1e90ff"}} alt="" />
                                    <h4 className="my-auto mx-2">Task List</h4>
                                </div>
                            </div>
                            <div className="card-body">
                                {
                                    taskList.length == 0 || taskList == null ? (
                                        
                                        <div>
                                            <div className={noTask ? "d-none" : ""}>
                                                <ShimmerLoader />
                                            </div>
                                            <h4 className={noTask ? "text-center" : "d-none "}>No Task found</h4>
                                        </div>
                                    ) : (

                                        <div className="table-responsive">
                                            <table ref={tableRef} className="table text-center table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th className="text-center">Title</th>
                                                        <th className="text-center">Status</th>
                                                        <th className="text-center text-nowrap">Due Date</th>
                                                        <th className="text-center text-nowrap">Assigned At</th>
                                                        <th className="text-center text-nowrap">Updated At</th>
                                                        {/* <th className="text-center">Assigned By</th> */}
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        taskList.map((item, index)=>(
                                                            <tr key={index}>
                                                                <td className="text-center">{index+1}</td>
                                                                <td className="text-center" style={{width:"30%"}}>{item.Title}</td>
                                                                <td className="text-center"><span className={(item.Status === "Pending") | (item.Status === "pending") ? "badge text-dark bg-warning badge-warning" : ((item.Status == "Completed") | (item.Status == "completed") ? "badge bg-success badge-success" : "badge bg-info badge-info")}>{item.Status}</span></td>
                                                                <td className="text-nowrap">{item.due_date}</td>
                                                                <td className="text-center">{item.AssignedAt ? item.AssignedAt : "-"}</td>
                                                                <td className="text-center">{item.UpdatedAt ? item.UpdatedAt : "-"}</td>
                                                                {/* <td className="text-center text-nowrap">{item.AssignedBy ? item.AssignedBy : "-" }</td> */}
                                                               

                                                                <td className="text-nowrap">
                                                                    <button data-bs-toggle="modal" data-bs-target="#exampleViewModal" data={item.id} className="btn btn-primary mx-2" type="submit" onClick={()=>{showTask(item.id)}}>View</button>
                                                                    {/* <button>View</button> */}
                                                                    <button data-bs-toggle="modal" data-bs-target="#exampleModal" data={item.id} className="btn btn-primary mx-auto" type="submit" onClick={()=>{showEditTask(item.id)}}>Edit</button>
                                                                    <button className="mx-2 btn btn-danger" type="submit" onClick={()=>{deleteTask(item.id)}}>Delete</button>
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
                                                <label htmlFor="" className="mb-2">Task</label>
                                                <input type="text" value={editTask.title} required onChange={inputData} className="form-control" name="title" id="" />
                                            </div>

                                            <div className="col-lg-12 mt-2">
                                                <label htmlFor="" className="mb-2">Task Details</label>
                                                <input type="text"  value={editTask.desc} required onChange={inputData} className="form-control" name="desc" id="" />
                                            </div>

                                            <div className="col-lg-12 mt-2">
                                                <label htmlFor="" className="mb-2">Due Date</label>
                                                <input type="date" value={editTask.due_date} required onChange={inputData} className="form-control" name="due_date" id="" />
                                            </div>
                                        </div>

                                        <div className="row form-group mt-3">
                                            <div className="col-lg-6">
                                                <button type="submit" onClick={()=>{updateTask(editTask.id)}} className="btn btn-primary">Save changes</button>
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

                <div className="row">
                
                    <div class="modal fade" id="exampleViewModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Task Details</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div class="modal-body">
                                    <p>Task Title</p>
                                    <h4 className="" style={{ color: "#333333" }}>{displayTask.Title}</h4>
                                    <hr />

                                    <p>Task Details</p>
                                    <h4 className="" style={{ color: "#333333" }}>{displayTask.Description}</h4>
                                    <hr />

                                    <div className="d-flex projectDetailCard">
                                        <div className="mx-3">
                                            <h5 >Due Date : </h5>
                                            <h6 className="badge badge-danger bg-danger">{displayTask.due_date}</h6>
                                        </div>
                                    </div>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    {/* <button type="button" class="btn btn-primary">Save changes</button> */}
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