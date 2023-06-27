import React, { useState } from "react";
// import "./addDevice.css";
import { useFile } from "../../context/index";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0NjhkMTgxMS1lOGI1LTQzZDUtYTg4OS0xYjliZWI1NjgzNTkiLCJlbWFpbCI6ImlpdDIwMjAxMDNAaWlpdGEuYWMuaW4iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOWFhMDdkOTBmNTc0NWRiOTQ2ODEiLCJzY29wZWRLZXlTZWNyZXQiOiI2ZDQxOWQ2MzBiZDkwODBhNWFhNGJmZDAyOGViNDM2MWIzNDEwNmRiYzJlMDU0YTZjZDVhM2NjMDRiNDg3MDllIiwiaWF0IjoxNjc5ODUxODMzfQ.-f10NGa3eB6SzzuXXxU-w4p450Bhourg9xJEJURqpgo`;

const AddDevice = ({ user, isAdmin }) => {
  const [deviceId, setDeviceId] = useState("");
  const [challengeFile, setChallengeFile] = useState(null);
  const [responseFile, setResponseFile] = useState(null);
  const [isDeviceAdded, setIsDeviceAdded] = useState(false);
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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


  // console.log(user);

  // Function to handle form submission
//   const handleSubmit = (event) => {

//     console.log(deviceId);
//     console.log(challengeFile);
//     console.log(responseFile);
//     const isFormComplete = deviceId !== "" && challengeFile !== null && responseFile !== null;
//     console.log(isFormComplete);
//     if(isFormComplete){
//       console.log("Successful");
//       // const chalHash = handleSubmission(challengeFile);
//       // const respHash = handleSubmission(responseFile);
//       // addDevices(chalHash,respHash,deviceId,user[4]);
//       // navigate('/profile');

//     } else{
//       toast("Fill all Field");
//     }
//     event.preventDefault();

// };

const handleSubmit = async (event) => {
  event.preventDefault();

  const isFormComplete = deviceId !== "" && challengeFile !== null && responseFile !== null;

  if (isFormComplete) {
    try {
      setLoading(true);
      const chalHash = await handleSubmission(challengeFile);
      const respHash = await handleSubmission(responseFile);
      console.log("challenge: "+chalHash);
      console.log("respHash: "+respHash);
      console.log(deviceId);
      console.log(user[4]);
      const data = await addDevices(chalHash, respHash, deviceId, user[4]);
      console.log("data");
      toast("File Uploaded Successfully!!");
      setTimeout(() => {
        navigate("/profile");
      }, 3000); // Wait for 3 seconds before navigating
    } catch (error) {
      toast("Error occurred while uploading files");
      setLoading(false);
    }
  } else {
    toast("Please fill in all fields");
  }
};


  const handleDeviceIdChange = (e) => {
    console.log(deviceId);
    setDeviceId(e.target.value);
  };

  const handleChallengeFileChange = (e) => {
    const file = e.target.files[0];
    setChallengeFile(file);
  };

  const handleResponseFileChange = (e) => {
    const file = e.target.files[0];
    setResponseFile(file);
  };

  const handleSubmission = async (file) => {

    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "File name",
    });

    console.log("metadata");

    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    setLoading(true);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      const ipfsHash = res.data.IpfsHash;
      console.log(ipfsHash);
      return ipfsHash;
    } catch (error) {
      console.log(error);
      return null;
    }
  };


  // Check if all entries are made

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
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Enter Device ID:</label>
          <input type="text" value={deviceId} onChange={handleDeviceIdChange} />
        </div>
        <div className="upload-group">
          <label>Upload Challenge:</label>
          <input type="file" onChange={handleChallengeFileChange} accept=".txt" />
        </div>
        <div className="upload-group">
          <label>Upload Response:</label>
          <input type="file" onChange={handleResponseFileChange} accept=".txt" />
        </div>
        <button type="submit">Submit</button>
      </form>
      <style jsx>{`
         .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #f9f9f9;
        }
        .form-group {
          margin-bottom: 10px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input[type="text"] {
          width: 100%;
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .upload-group {
          margin-top: 10px;
        }
        .submit-button {
          padding: 10px 20px;
          font-size: 18px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
        }
      `}</style>
    </div>
    </>
  );
};

export default AddDevice;
