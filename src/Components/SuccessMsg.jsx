import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function SuccessMsg()
{
    return(
        <>
        {
            MySwal.fire({
                title: "Data updated successfully!",
                icon: "success",
                draggable: true
            })
        }
        </>
    )
}

export default SuccessMsg;