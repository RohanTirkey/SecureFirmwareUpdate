import React, { useState } from "react";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./signUpAdmin.css";
import { useFile } from "../../context/index";
import PacmanLoader from "react-spinners/PacmanLoader";
const signupadmin = ({ isLogedIn, logedinHandler, adminHandler }) => {
  const [user, setUser] = useState({
    fname: "",
    uname: "",
    email: "",
    mId:"",
  });

  const [loading, setLoading] = useState(false);

  const {
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
    fileDataforManufacture,
    fileDataForDevice
  } = useFile();

  const address = useAddress();
  const connect = useMetamask();

  const userHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  };

  const registerHandler = async () => {
    // console.log(user);
    await connect();
    // await address();
    console.log("address", address);
    // console.log(typeof address);

    if (address != undefined) {
      setLoading(true);
      let signup = await signUpFunction(
        address,
        user.fname,
        user.uname,
        user.email,
        true,
        user.mId
      );

      let cc = await signup.receipt;

      console.log(cc);

      if (cc != undefined) {
        const signupuser = [user.fname, user.uname, user.email, address, user.mId];
        console.log(signupuser);
        logedinHandler(signupuser);

        // check for admin in backend
        let isadmin = await isAdminFunction(address);
        console.log(isadmin, "SignUp admin");

        if (isadmin == true) await adminHandler();
      }

      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <PacmanLoader color="#36d7b7" className="loader" size="50px" />
      ) : (
        <div className="signup">
          {isLogedIn && <Navigate to="/" replace={true} />}

          <div className="register-form">
            <div className="para">
              please sign up using Metamask account.
            </div>
            <div className="input-container">
              <label>Name</label>
              <input type="text" name="fname" required onChange={userHandler} />
            </div>

            <div className="input-container">
              <label>User Name</label>
              <input type="text" name="uname" required onChange={userHandler} />
            </div>

            <div className="input-container">
              <label>Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={userHandler}
              />
            </div>

            <div className="input-container">
              <label>Manufacture ID</label>
              <input type="text" name="mId" required onChange={userHandler} />
            </div>

            <div className="button-container">
              <button className="registerBtn" onClick={registerHandler}>
                Sign Up with Metamask
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default signupadmin;
