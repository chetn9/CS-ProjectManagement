import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function SideBar() 
{
	const navigate = useNavigate();
    const auth = getAuth();



	const logOutBtn = async ()=>{

        await signOut(auth);
        // localStorage.removeItem("userId");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("user");
        // setIsAuthenticated(false);
        // useNavigate("/Login");
        navigate("/Login");
    }

    return(
        <>
			<aside id="sidebar" className="sidebar">
				<ul className="sidebar-nav" id="sidebar-nav">

					<li className="nav-item">
						<Link to="/" className="nav-link link"><i className="bi bi-grid"></i> Home</Link>
					</li>

					<li className="nav-item">
						<Link to="/Student-List" className="nav-link link"><i className="bi bi-people"></i> Student List</Link>
					</li>

					<li className="nav-item">
						<Link to="/Project-List" className="nav-link link"><i className="bi bi-list-task"></i> Project List</Link>
					</li>

					<li className="nav-item">
						<Link to="/Manage-Stream" className="nav-link link"><i className="bi bi-mortarboard"></i> Manage Stream</Link>
					</li>

					<li className="nav-item">
						<Link to="/Manage-TechDatabase" className="nav-link link"><i className="bi bi-cpu"></i> Manage Tech & Database</Link>
					</li>

					<li className="nav-item">
						<Link to="/Faculty-List" className="nav-link link"><i className="bi bi-person-circle"></i> Faculty List</Link>
					</li>

					<li className="nav-item">
						<Link to="/Add-New" className="nav-link link"><i className="bi bi-person-add"></i> Add New Record</Link>
					</li>

					{/* <li className="nav-item">
						<Link to="/Add-New" className="nav-link link"><i className="bi bi-gear"></i> Settings</Link>
					</li>

					<li className="nav-item">
						<Link to="/Add-New" className="nav-link link"><i className="bi bi-megaphone"></i> Announcement</Link>
					</li> */}

					<li className="nav-item">
						<Link to="/Profile" className="nav-link link"><i className="bi bi-person-circle"></i> Profile</Link>
					</li>

					<li className="nav-item mt-4">
						
						<button type="submit" onClick={logOutBtn} className="btn btn-warning btn-sm">Log Out <i className="bi bi-box-arrow-right"></i></button>
					</li>

				</ul>

			</aside>
        </>
    );
}

export default SideBar;