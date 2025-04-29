import { useEffect, useState } from "react";
import { database } from "../../Firebase/firebase-config";
import { getDatabase, ref, onValue, remove, push, off, update, query, orderByChild, equalTo, get } from "firebase/database";
import ShimmerLoader from "../../Components/ShimmerEffect";
import LinkButton from "../../Components/UpdateLinkButton";
import SuccessMsg from "../../Components/SuccessMsg";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Modal } from "react-bootstrap";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import projectImg from "../../assets/icons/electronics_web_light_96.png";
import dbImg from "../../assets/icons/database_web_light_96.png";

function ManageDatabase()
{
    const MySwal = withReactContent(Swal);
    DataTable.use(DT);

    const [dbList, setDbList] = useState(null);
    const [techList, setTechList] = useState(null);
    const [show, setShow] = useState(false);
    const [tech_db, setTechDB] = useState({
        tech_db_id: "",
        tech_db: "",
    });

    const [lable, setLable] = useState({
        title: "",
        input: "",
    });


    // Close Modal
    const handleClose = () => {
        setShow(false)
        setTechDB("");
    };

    // Show Modal
    const handleShow = (data) => {
        // console.log(data.mode);
        setLable({title: data.title, input: data.input, mode: data.mode});
        setShow(true);

        if(data.mode === "update")
        {
            // setTechDB({tech_db: data.techDB_ID});
            if(data.input === "Technology")
            {   
                const dataRef = ref(database, 'technology_database/technologies/'+data.techDB_ID);

                onValue(dataRef, (snapshot)=>{
                    const dataFromFirebase = snapshot.val();
                    // console.log(dataFromFirebase);
                    if(dataFromFirebase)
                    {
                        setTechDB({
                            tech_db_id: snapshot.key,
                            tech_db: dataFromFirebase.technology,
                        });

                        // console.log("Tech ",dataFromFirebase.technology);
                    }
                    else
                    {
                        setTechDB({});
                    }
                });
                // console.log(data.techDB_ID);
            }

            if(data.input === "Database")
            {   
                const dataRef = ref(database, 'technology_database/databases/'+data.techDB_ID);

                onValue(dataRef, (snapshot)=>{
                    const dataFromFirebase = snapshot.val();
                    // console.log(dataFromFirebase);
                    if(dataFromFirebase)
                    {
                        setTechDB({
                            tech_db_id: snapshot.key,
                            tech_db: dataFromFirebase.database,
                        });

                        // console.log("DB ",dataFromFirebase.database);
                    }
                    else
                    {
                        setTechDB({});
                    }
                });
                // console.log(data.techDB_ID);
            }
        }
    }

    const [techTxt, setTechTxt] = useState({
        techName: "",
    });
    const [databaseTxt, setDatabaseTxt] = useState({
        dbName: "",
    });

    // For getting Database
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

        // console.log(dbList);

        return ()=>{
            setDbList(null);
            off(dataRef);
        }

    }, []);

    // For getting Technology
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
            off(dataRef);
        }

    }, []);


    const inputData = (e)=> {
        const {name, value} = e.target;

        setTechDB((prevData)=>({
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

    // Adding Data
    const addData = async (e)=>{

        e.preventDefault();

        if(lable.mode === "add")
        {
            if(lable.input === "Technology")
            {
                if(tech_db.tech_db === "" || tech_db.tech_db === null || tech_db.tech_db === undefined)
                {
                    MySwal.fire({
                        title: "Please Enter Technology!",
                        icon: "warning",
                        draggable: true
                    });
                }
                else
                {
                    const dataRef = ref(database, 'technology_database/technologies');
        
                    const duplicateQuery = query(dataRef, orderByChild('technology'), equalTo(tech_db.tech_db));

                    const snapshot = await get(duplicateQuery);
                    console.log(snapshot);

                    if (snapshot.exists()) {
                        console.log("Duplicate Technology found. Not adding.");
                        setShow(false)
                        tech_db.tech_db = "";
        
                        MySwal.fire({
                            title: "Duplicate Technology found!",
                            icon: "error",
                            draggable: true
                        });
                        return;
                    }

                    push(dataRef,{
                        technology: tech_db.tech_db
        
                    }).then(() => {
                        setShow(false)
                        tech_db.tech_db = "";
        
                        MySwal.fire({
                            title: "Record added successfully!",
                            icon: "success",
                            draggable: true
                        });
                    })
                    .catch((error) => {
                        console.error("Error: ", error.message);
                    });
        
                    // console.log("Add to Tech ", tech_db.tech_db);
                }
            }
    
            if(lable.input === "Database")
            {
                if(tech_db.tech_db === "" || tech_db.tech_db === null || tech_db.tech_db === undefined)
                {
                    MySwal.fire({
                        title: "Please Enter Database!",
                        icon: "warning",
                        draggable: true
                    });
                }
                else
                {
                    const dataRef = ref(database, 'technology_database/databases');
        
                    const duplicateQuery = query(dataRef, orderByChild('database'), equalTo(tech_db.tech_db));

                    const snapshot = await get(duplicateQuery);
                    console.log(snapshot);

                    if (snapshot.exists()) {
                        console.log("Duplicate Database found. Not adding.");
                        setShow(false)
                        tech_db.tech_db = "";
        
                        MySwal.fire({
                            title: "Duplicate Database found!",
                            icon: "error",
                            draggable: true
                        });
                        return;
                    }

                    push(dataRef,{
                        database: tech_db.tech_db
        
                    }).then(() => {
                        setShow(false)
                        
                        MySwal.fire({
                            title: "Record added successfully!",
                            icon: "success",
                            draggable: true
                        });
                    })
                    .catch((error) => {
                        console.error("Error: ", error.message);
                    });
                    console.log("Add to DB ", tech_db.tech_db);
                }
            }
        }
    }

    // Updating Data
    const editTechDB = (e) => {
        if(lable.input === "Technology")
        {
            const dataRef = ref(database, 'technology_database/technologies/'+e);

            if(dataRef != null)
            {
                update(dataRef, {
                    technology: tech_db.tech_db,
                    
                }).then(()=>{
                    setShow(false)

                    MySwal.fire({
                        title: "Updated! ",
                        text: "Record has been updated.",
                        icon: "success"
                    });
                }).catch((error)=>{
                    console.log("Error in catch", error);
                });
            }
        }

        if(lable.input === "Database")
        {
            const dataRef = ref(database, 'technology_database/databases/'+e);

            if(dataRef != null)
            {
                update(dataRef, {
                    database: tech_db.tech_db,
                    
                }).then(()=>{
                    setShow(false)

                    MySwal.fire({
                        title: "Updated! ",
                        text: "Record has been updated.",
                        icon: "success"
                    });
                }).catch((error)=>{
                    console.log("Error in catch", error);
                });
            }
        }
    }

    // Delete Tech
    const deleteTech = (e)=>{
        const dataRef = ref(database, 'technology_database/technologies/'+e);

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

    // Delete DB
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
        <div className="container">
            <div className="row justify-content-center">

                {/* Getting Technology */}
                <div className="col-lg-6">
                    <div className="card overflow-hidden cardForRadius">
                        <div className="card-header bg-white border-0 text-dark p-3">
                            <div className="d-flex align-items-center projectCard">
                                <img src={projectImg} style={{background: "#1e90ff"}} alt="" />
                                <h4 className="my-auto mx-3">Technology for Project</h4>
                                {/* <button onClick={() => openModal('This is content from Button 1')}>Open Modal 1</button> */}
                                {/* <button type="button" name="addTechBtn" data-bs-toggle="modal" data-bs-target="#exampleModal" className="my-auto btn btn-light float-end">Add new</button> */}
                               
                            </div>
                        </div>
                        <div className="card-body">
                                {
                                    techList === null ? (
                                        <ShimmerLoader />
                                    ) :(

                                        <div>
                                            <div className="d-flex align-items-center">
                                                <Button className="mb-2 btn btn-success float-end" variant="primary" onClick={() => handleShow({ title: "Add Technology", input: "Technology", mode: "add" })}>
                                                <i className="bi bi-cpu"></i> Add Technology
                                                </Button>
                                            </div>

                                            <DataTable className="table table-bordered text-center">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th className="text-center">Technology</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>
                        
                                                <tbody>
                                                
                                                    {
                                                        techList.map((item, index)=>(
                                                            
                                                            <tr key={index}>
                                                                <td className="text-center">{index+1}</td>
                                                                <td>{item.technology}</td>
                                                                
                                                                <td className="text-nowrap">
                                                                    {/* <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-outline-primary">Edit</button> */}
                                                                    {/* <LinkButton type={"button"} text={"Edit"} data-bs-toggle="modal" data-bs-target="#exampleModal"/> */}
                                                                    
                                                                    <button className="btn btn-outline-primary" onClick={() => handleShow({ title: "Update Technology", input: "Technology", techDB_ID: item.id, mode: "update" })}>
                                                                    <i className="bi bi-pencil"></i> Edit
                                                                    </button>

                                                                    <button onClick={()=>deleteTech(item.id)} className="mx-2 btn btn-outline-danger" type="submit">Delete <i className="bi bi-x-circle-fill"></i></button>
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

                {/* Getting Databases */}
                <div className="col-lg-6 mt-lg-0 mt-3">
                    <div className="card overflow-hidden cardForRadius">
                        <div className="card-header bg-white border-0 text-dark p-3">
                            <div className="d-flex align-items-center projectCard">
                                <img src={dbImg} style={{background: "#1e90ff"}} alt="" />
                                <h4 className="my-auto mx-3">Databases for Project</h4>
                                
                                {/* <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="my-auto btn btn-light float-end">Add new </button> */}
                            </div>
                        </div>
                        <div className="card-body">
                                {
                                    dbList == null ? (
                                        <ShimmerLoader />
                                    ) :(

                                        <div className="table-responsive">
                                            <div>
                                                <Button className="mb-2 btn btn-success" variant="primary" onClick={() => handleShow({ title: "Add Database", input: "Database", mode: "add" })}>
                                                <i className="bi bi-database-add"></i> Add Database
                                                </Button>
                                            </div>  

                                            <DataTable className="table table-bordered text-center">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">#</th>
                                                        <th className="text-center">Stream</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>
                        
                                                <tbody>
                                                   
                                                    {
                                                        dbList.map((item, index)=>(
                                                            
                                                            <tr key={index}>
                                                                <td className="text-center">{index+1}</td>
                                                                <td className="text-center">{item.database}</td>
                                                                <td className="text-center">
                                                                    {/* <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-outline-primary">Edit</button> */}
                                                                    {/* <LinkButton type={"button"} text={"Edit"} data-bs-toggle="modal" data-bs-target="#exampleModal"/> */}
                                                                    
                                                                    <button className="btn btn-outline-primary" onClick={() => handleShow({ title: "Update Database", input: "Database", techDB_ID: item.id, mode: "update" })}>
                                                                    <i className="bi bi-pencil"></i> Edit
                                                                    </button>

                                                                    <button onClick={()=>deleteDB(item.id)} className="mx-2 btn btn-outline-danger" type="submit">Delete <i className="bi bi-x-circle-fill"></i></button>
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

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{lable.title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>{lable.title}</Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder={`Enter ${lable.input}`}
                                    onChange={inputData}
                                    value={tech_db.tech_db}
                                    autoFocus
                                    name="tech_db"/>

                            </Form.Group>
                            
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>

                        {
                            lable.mode === "add" ? (
                                <Button variant="primary" onClick={addData}>
                            Save Changes
                        </Button>
                            ):(
                                <Button variant="primary" onClick={()=>editTechDB(tech_db.tech_db_id)}>
                            Update
                        </Button>
                            )
                        }
                        

                    </Modal.Footer>
                </Modal>
                {/* <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                </div> */}
                
            </div>
        </div>
    </>
    );
}

export default ManageDatabase;