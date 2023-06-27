import React, { useCallback, useState } from "react";
import "./App.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./pages/Navbar/navbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages";
import Login from "./pages/signin/Signin";
import Register from "./pages/signUp/Tabs";
import FileUpload from "./pages/FileUpload/FileUpload";
import HomePage from "./pages/homePage/homePage";
import Profile from "./pages/profile/Profile";
import History from "./pages/history/History";
import AddDevice from "./pages/AddDevice/addDevice";
import Validate from "./pages/validate/validate";

const user = JSON.parse(localStorage.getItem("user"));

const App = () => {
  const [isLogedIn, setIsLogedIn] = useState(
    JSON.parse(localStorage.getItem("isLogedIn"))
  );

  const [data, setData] = useState(JSON.parse(localStorage.getItem("user")));
  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("isAdmin"))
  );

  const [ipfs, setIpfs] = useState(JSON.parse(localStorage.getItem("IPFS")));

  const IPFSHandler=(key)=>{
    localStorage.setItem("IPFS", JSON.stringify(key));
    console.log(key);
  };

  const logOutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLogedIn");
    localStorage.removeItem("isAdmin");
    setIsLogedIn(false);
    setIsAdmin(false);
    console.log("log out");
  };

  const logedinHandler = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLogedIn", JSON.stringify(true));
    setIsLogedIn(true);
    console.log("loged in", user);
  };

  const adminHandler = () => {
    setIsAdmin(true);
    localStorage.setItem("isAdmin", JSON.stringify(true));
    console.log("loged in is admin");
  };

  return (
    <div className="App">
      <Router>
        <div className="navBar">
          <Navbar
            isLogedIn={isLogedIn}
            logOutHandler={logOutHandler}
            isAdmin={isAdmin}
          />
        </div>

        <div>
          <Routes>
            <Route
              path="/"
              element={<HomePage user={user} IPFSHandler={IPFSHandler}/>}
            />
              }
            />

            <Route
              path="/login"
              element={
                <Login
                  isLogedIn={isLogedIn}
                  logedinHandler={logedinHandler}
                  adminHandler={adminHandler}
                />
              }
            />

            <Route
              path="/register"
              element={
                <Register
                  isLogedIn={isLogedIn}
                  logedinHandler={logedinHandler}
                  adminHandler={adminHandler}
                />
              }
            />

            <Route
              path="/fileUpload"
              element={<FileUpload user={user} isAdmin={isAdmin} />}
            />

            <Route
              path="/addDevice"
              element={<AddDevice user={user} isAdmin={isAdmin} />}
            />

            <Route
              path="/history"
              element={<History isAdmin={isAdmin} user={user} />}
            />

            <Route
              path="/profile"
              element={
                <Profile isAdmin={isAdmin} user={user} isLogedIn={isLogedIn} />
              }
            />

            <Route
              path="/validate"
              element={
                <Validate
                  ipfs={ipfs}
                  user={user}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
