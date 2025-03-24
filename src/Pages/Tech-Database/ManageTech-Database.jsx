import { useEffect, useState } from "react";
import { database } from "../../Firebase/firebase-config";
import { getDatabase, ref, onValue, remove, push } from "firebase/database";
import ShimmerLoader from "../../Components/ShimmerEffect";
import LinkButton from "../../Components/UpdateLinkButton";
import SuccessMsg from "../../Components/SuccessMsg";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Modal } from "react-bootstrap";


const MySwal = withReactContent(Swal)

function ManageDatabase()
{
    const [dbList, setDbList] = useState(null);
    const [techList, setTechList] = useState(null);

    const [techTxt, setTechTxt] = useState({
        techName: "",
    });
    const [databaseTxt, setDatabaseTxt] = useState({
        dbName: "",
    });

    // For Database
    useEffect(()=>{
        const dataRef = ref(database, 'technology_database/databases');

        onValue(dataRef, (snapshot)=>{
            const getData = snapshot.val();

            if(getData)
            {
                const dbArray = Object.entries(getData).map(([id, db])=>({
                    id,
                    ...db,
                }));
                
                setDbList(dbArray);
            }
            else
            {
                console.log("No Data");
                setDbList([]);
            }
        });

        console.log(dbList);

        return ()=>{
            setDbList(null);
        }

    }, []);

    // For Technology
    useEffect(()=>{
        const dataRef = ref(database, 'technology_database/technologies');

        onValue(dataRef, (snapshot)=>{
            const getData = snapshot.val();

            if(getData)
            {
                const techArray = Object.entries(getData).map(([id, tech])=>({
                    id,
                    ...tech,
                }));
                
                setTechList(techArray);
            }
            else
            {
                console.log("No Data");
                setTechList([]);
            }
        });

        return ()=>{
            setTechList(null);
        }

    }, []);

    const inputData = (e)=> {
        const {name, value} = e.target;

        setDatabaseTxt((prevData)=>({
            ...prevData,
            [name]: value,
        }));
    };

    const inputData2 = (e)=> {
        const {name, value} = e.target;

        setTechTxt((prevData)=>({
            ...prevData,
            [name]: value,
        }));
    };

    const deleteDB = (e)=>{
        const dataRef = ref(database, 'technology_database/databases/'+e);

        onValue(dataRef, (snapshot)=>{
            if(snapshot.exists())
            {
                // MySwal.fire({
                //     title: "Data updated successfully!",
                //     icon: "success",
                //     draggable: true
                // })
                // <ShimmerLoader/>
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
                
            }
        });
    }



    const formSubmit = (e)=>{
        e.preventDefault();

        if(e.target[0].name === 'dbName')
        {
            console.log(e.target[0].name);
        }
        else if(e.target[0].name === 'techName')
        {
            console.log(e.target[0].name);
        }
        const dataRef = ref(database, 'technology_database/databases');

        // push(dataRef, {
        //     "database": databaseTxt.dbName,
        // })
        // .then(()=>{
            
        //     MySwal.fire({
        //         title: "Data updated successfully!",
        //         icon: "success",
        //         draggable: true
        //     });

        //     setDatabaseTxt('');
        // })
        // .catch((error)=>{
        //     console.error(error);
        // });

        console.log("Txt", e.target[0]);
    }

    return (
    <>
        <div className="container mt-3">
            <div className="row justify-content-center">

                {/* Getting Technology */}
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header bg-dark text-light">
                            <div className="d-block">
                                <h4 className="my-auto float-start">Technology for Project</h4>
                                <button type="button" name="addTechBtn" data-bs-toggle="modal" data-bs-target="#exampleModal" className="my-auto btn btn-light float-end">Add new</button>
                            </div>
                        </div>
                        <div className="card-body">
                                {
                                    techList == null ? (
                                        <ShimmerLoader />
                                    ) :(

                                        <table className="table table-bordered text-center">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Technology</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                    
                                            <tbody>
                                                <tr>
                                                    
                                                </tr>
                                                {
                                                    techList.map((item, index)=>(
                                                        
                                                        <tr key={index}>
                                                            <td>{index+1}</td>
                                                            <td>{item.technology}</td>
                                                            <td>
                                                                <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-outline-primary">Edit</button>
                                                                {/* <LinkButton type={"button"} text={"Edit"} data-bs-toggle="modal" data-bs-target="#exampleModal"/> */}
                                                                <span className="mx-2">|</span>
                                                                <button onClick={()=>deleteDB(item.id)} className="btn btn-outline-danger" type="submit">Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    )
                                }
                        </div>
                    </div>
                </div>


                {/* Getting Databases */}
                <div className="col-lg-6 mt-lg-0 mt-3">
                    <div className="card">
                        <div className="card-header bg-dark text-light">
                            <div className="d-block">
                                <h4 className="my-auto float-start">Databases for Project</h4>
                                <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="my-auto btn btn-light float-end">Add new </button>
                            </div>
                        </div>
                        <div className="card-body">
                                {
                                    dbList == null ? (
                                        <ShimmerLoader />
                                    ) :(

                                        <table className="table table-bordered text-center">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Stream</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                    
                                            <tbody>
                                                <tr>
                                                    
                                                </tr>
                                                {
                                                    dbList.map((item, index)=>(
                                                        
                                                        <tr key={index}>
                                                            <td>{index+1}</td>
                                                            <td>{item.database}</td>
                                                            <td>
                                                                <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-outline-primary">Edit</button>
                                                                {/* <LinkButton type={"button"} text={"Edit"} data-bs-toggle="modal" data-bs-target="#exampleModal"/> */}
                                                                <span className="mx-2">|</span>
                                                                <button onClick={()=>deleteDB(item.id)} className="btn btn-outline-danger" type="submit">Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
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
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Add new Database</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={formSubmit}>
                                    <div className="row form-group">
                                        <div className="col-lg-12">
                                            <label htmlFor="" className="mb-2">Database</label>
                                            <input type="text" required value={databaseTxt.dbName} onChange={inputData} className="form-control" name="dbName" id="" />
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

export default ManageDatabase;