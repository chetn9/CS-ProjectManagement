import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function EditProject(){

    const {projectId} = useParams();
    const [projectData, setProjectData] = useState([]);

    useEffect(()=>{
        const loadData = async ()=>{
            await axios.get(`http://127.0.0.1:8000/api/edit/${projectId}`)
            .then((response)=>{
                console.log(response.data);
                const project = Object.values(response.data);
                setProjectData(project);
            })
            .catch((error)=>{
                console.log(error);
            })
        };

        loadData();
        
    }, [projectId])

    return (
        <>
            <pre>
                {[projectData]}
            </pre>
        </>
    );
}

export default EditProject