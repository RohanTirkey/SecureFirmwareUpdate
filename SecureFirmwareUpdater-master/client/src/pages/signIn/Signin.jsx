import React, { useEffect } from "react";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./signin.css";
import { useFile } from "../../context/index";
import logo from "./1.avif";
const Signin = ({ isLogedIn, logedinHandler, adminHandler }) => {
  const connect = useMetamask();
  const address = useAddress();

  // console.log("Hello from signin");
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
  } = useFile();

  const handleSubmission = async () => {
    await connect();
    // await address();
    console.log("address", address);
    // console.log(typeof address);

    if (address != undefined) {
      let signin = await signInFunction(address);

      console.log(signin.isexist);

      if (signin.isexist == true) {
        console.log(signin);
        const user = [signin.name, signin.username, signin.email, address, signin.adminId];
        console.log(user);
        logedinHandler(user);

        // check for admin in backend
        let isadmin = await isAdminFunction(address);
        console.log(isadmin, "Signin admin");

        if (isadmin == true) await adminHandler();
      }
    }
  };

  return (
    <div className="login">
      {isLogedIn && <Navigate to="/" replace={true} />}
      <div className="right">
        <div className="para">
          Welcome to our secure firmware file update website! If you are
          already a registered user, please sign in using your Metamask account.
        </div>
        <button className="btn" onClick={handleSubmission}>
          Sign In With MetaMask
        </button>
      </div>
    </div>
  );
};

export default Signin;
