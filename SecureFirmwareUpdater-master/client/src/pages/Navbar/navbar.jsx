import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "./logo.jpeg";
import "./navbar.css";

const Navbar = ({ isLogedIn, logOutHandler, isAdmin }) => {
  const navigate = useNavigate();
  const logOutfun = () => {
    // console.log("log out clicked..");
    logOutHandler();
    navigate("/login");
  };

  return (
    <div className="Navbar">
      {/* <img src={logo} alt="Logo" className="logo" /> */}
      <div className="logo">SFU</div>
      <ul className="ul">
        
        {isLogedIn && (
          <>
            <li>
              <NavLink exact to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
          </>
        )}

        {isLogedIn ? (
          <>
            <li className="logOut" onClick={logOutfun}>LogOut</li>
          </>
        ) : (
          <>
            <li>
              <NavLink activeClassName="active" to="login">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="register">
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
