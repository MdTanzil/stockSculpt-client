/* eslint-disable no-unused-vars */

import { Link, NavLink } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const NavLinkCustom = ({ children ='', to ='' }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [isActive ? " btn btn-sm border-0  btn-secondary" : ""].join(" ")
      }
    >
      <li>
        <p className="btn btn-sm btn-primary shadow">{children}</p> 
      </li>
    </NavLink>
  );
};

export default NavLinkCustom;
