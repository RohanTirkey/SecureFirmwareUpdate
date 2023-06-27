import React, { useState, useEffect } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profileimg from "./web-user.jpg";
import axios from "axios";
import { useFile } from "../../context/index";

const Profile = ({ isAdmin, user, isLogedIn }) => {
  // console.log("Profile:"+user);
  const navigate = useNavigate();
  // console.log(user[0]);
 const {
    address,
    contract,
    connect,
    fileData,
    addFileFunction,
    isAdminFunction,
    signInFunction,
    signUpFunction,
    newDownloadByUserFunction,
    adminAddFunction,
    filesUploadedbyAdmin,
    filesdownloadedbyUser,
    addDevices,
    getFilesByDeviceId,
    getDevicesByMId,
    fileDataforManufacture,
    fileDataForDevice
  } = useFile();
  
  // console.log(devices);

  const [newAdmin, setNewAdmin] = useState("");

  const changenewAdmin = (event) => {
    setNewAdmin(event.target.value);
  };

  const submitNewAdmin = async () => {
    await adminAddFunction(user[3], newAdmin);
  };

  const historyHandler = async () => {
    const data = await filesdownloadedbyUser(user[3]);

    if (data.length == 0) {
      toast("You are not Downloaded any firmware file yet...");
    } else {
      navigate("/history");
    }
  };

  const uploadHandler = () => {
    navigate("/fileUpload");
  };

   const selectDevice = () => {
    navigate("/addDevice");
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <ToastContainer />

      <div className="section">
        <div className="profilehead"> User profile</div>
        <div className="container">
          <div className="left">
            <img
              src={profileimg}
              alt="avatar"
              className="rounded-circle"
              width="80%"
              height="90%"
            ></img>
          </div>

          <div className="right">
            <div className="username">Name : {user[0]}</div>
            <div className="username">UserName : {user[1]}</div>
            <div className="useremail">Email : {user[2]}</div>
            <div className="address">MetaMask Address : {user[3]}</div>

            <div className="btns">
              <button className="btn" onClick={historyHandler}>
                Check History
              </button>

              {isAdmin && (
                <button className="btn" onClick={uploadHandler}>
                  Upload File
                </button>
              )}

              {isAdmin && (
                <button className="btn" onClick={selectDevice}>
                  Add Device
                </button>
              )}

            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="bottom">
            <div className="para">
              Please provide the Metamask address of the new user if you would
              like to add them as an admin.
            </div>
            <div className="inner">
              <input
                className="form-control"
                type="text"
                placeholder="Input New Admin Address"
                onChange={changenewAdmin}
              />

              <button className="btn" onClick={submitNewAdmin}>
                Admin Add
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
