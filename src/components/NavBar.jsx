import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NavLinkCustom from "./NavLinkCustom";
import logo from "/logo.png";
import useShop from "../hooks/useShop";
const NavBar = () => {
  const { user ,logOut} = useAuth();
  const {data} = useShop()

  // console.log(shopData );
  const navList = (
    <>
      <NavLinkCustom to={"/"}>Home</NavLinkCustom>
      {
        data?.roll === "shopAdmin" ? <> 
        <NavLinkCustom to={'/dashboard'}>Dashboard</NavLinkCustom>
      <NavLinkCustom to={"/subscription"}>Subscription</NavLinkCustom>

        </> : <>
      <NavLinkCustom to={"/create-store"}> Create shop </NavLinkCustom>
        </>
      }
      {/* <NavLinkCustom to={"/create-store"}> Create shop </NavLinkCustom> */}
      <NavLinkCustom to={"/watch-video"}> Watch Video </NavLinkCustom>


      {/* <li className="">
        <a>Create-Shop</a>
      </li>
      <NavLink to={'/login'} 
     
     >
      <li>
        <a>Login</a>
      </li>
      </NavLink> */}
    </>
  );
  // console.log(user);



  return (
    <div className="navbar bg-primary text-black md:text-white">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navList}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">
          <img className=" w-40" src={logo} alt="" />
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-4">{navList}</ul>
      </div>
      <div className="navbar-end">
        {!user ? (
          <Link to={"/login"} className="btn  btn-primary shadow-lg ">
            Login
          </Link>
        ) : (
          <>
            <div className="dropdown dropdown-bottom dropdown-end">
              <label tabIndex={0} className=" m-1">
              <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={user?.photoURL} />
              </div>
            </div>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow  rounded-box w-52 bg-secondary"
              >
                 <li>
                  <p className="text-bold text-primary">Hi ! {user?.displayName}</p>
                </li>
                
                <li>
                  <button onClick={()=> logOut()} className="btn btn-sm btn-primary ">Logout</button>
                </li>
              </ul>
            </div>
            
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
