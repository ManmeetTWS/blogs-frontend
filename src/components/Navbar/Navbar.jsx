import { useLogout } from "../../hooks/useLogout";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuthContext } from "../../hooks/useAuthContext";

function Navbar() {
    const { userData } = useAuthContext()
    const {logout} = useLogout();

    const handleLogout = () => {
        logout();
    }

  return (
    <div className="navbar">
      <div className="navbar-inner-content">
        <div className="logo">
          <h1>BlogsApp</h1>
        </div>

        <div className="items">
          <div className="item">
            <Link to="/blogApp">Blogs</Link>
          </div>
          <div className="item">
            <Link to="/createBlog">Create Blog</Link>
          </div>
          {userData && <Link to='/yourBlogs'><div className="item" style={{cursor:"pointer", color:'black'}}>{userData?.user.username}</div></Link>}
          <div className="item">
            {userData && <button style={{padding:'4px 8px'}} onClick={handleLogout}>Logout</button>}
            {!userData && <Link to='/login' ><button style={{padding:'4px 8px', cursor:"pointer"}}>Log In</button></Link>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
