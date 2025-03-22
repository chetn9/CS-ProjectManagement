import { useEffect, useState } from "react";
import { database } from "../../Firebase/firebase-config";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ShimmerLoader from "../../Components/ShimmerEffect";
import LinkButton from "../../Components/UpdateLinkButton";

const MySwal = withReactContent(Swal)

function ManageTechnology()
{
    const [techList, setTechList] = useState(null);

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
        <div className="container">
            <div className="row">
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header bg-dark text-light">
                            <h4 className="my-auto">Stream Data</h4>
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
                                                    <th>Stream</th>
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
                                                            <td>{item.stream}</td>
                                                            <td>
                                                                <LinkButton text={"Edit"}/>
                                                                <span className="mx-2">|</span>
                                                                <button onClick={()=>deleteStream(item.id)} className="btn btn-outline-danger" type="submit">Delete</button>
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
        </div>
    </>
    );
}

export default ManageTechnology;