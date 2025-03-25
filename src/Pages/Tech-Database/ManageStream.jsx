import { useEffect, useState } from "react";
import { database } from "../../Firebase/firebase-config";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import ShimmerLoader from "../../Components/ShimmerEffect";
import LinkButton from "../../Components/UpdateLinkButton";

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';


function ManageStream()
{
    const [techList, setTechList] = useState(null);
    const MySwal = withReactContent(Swal);
    DataTable.use(DT);
    
    
    useEffect(()=>{
        const dataRef = ref(database, 'streams/');

        onValue(dataRef, (snapshot)=>{
            const getData = snapshot.val();

            if(getData)
            {
                const techArray = Object.entries(getData).map(([id, stream])=>({
                    id,
                    ...stream,
                }));
                
                setTechList(techArray);
            }
            else
            {
                console.log("No Data");
                setTechList([]);
            }
        });

        console.log(techList);

        return ()=>{
            setTechList(null);
        }

    }, []);

    const deleteStream = (e)=>{
        const dataRef = ref(database, 'streams/'+e);

        onValue(dataRef, (snapshot)=>{
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
        });
        
    }

    return (
    <>
        <div className="container mt-3">
            <div className="row">
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <form action="">
                                <div className="row form-group">
                                    <div className="col-lg-12">
                                        <label htmlFor="" className="mb-2">Enter Stream</label>
                                        <input type="text" placeholder="Enter Stream" className="border border-info form-control" name="stream" id="" />
                                    </div>

                                    <div className="col-lg-6">
                                       
                                        <button type="submit" className="btn btn-primary mt-4">Add Stream</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-1"></div>

                <div className="col-lg-7">
                    <div className="card"> {/*#d6dcf9*/}
                        <div className="card-header text-success" >
                            <h4 className="my-auto">Stream Data</h4>
                        </div>
                        <div className="card-body">
                                {
                                    techList === null ? (
                                        <ShimmerLoader />
                                    ) :(

                                        <div className="table-responsive">

                                            <DataTable className="table text-center table-bordered ">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">#</th>
                                                        <th className="text-center">Stream</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>
                        
                                                <tbody>
                                                    
                                                    {
                                                        techList.map((item, index)=>(
                                                            
                                                            <tr key={index}>
                                                                <td className="text-center">{index+1}</td>
                                                                <td className="text-center">{item.stream}</td>
                                                                <td className="text-center">
                                                                    <LinkButton text={"Edit"} />
                                                                    
                                                                    <button onClick={()=>deleteStream(item.id)} className="mx-2 btn btn-outline-danger" type="submit">Delete</button>
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
        </div>
    </>
    );
}

export default ManageStream;