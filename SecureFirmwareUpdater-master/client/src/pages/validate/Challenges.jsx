import React, { useState ,useEffect} from "react";
import crypto from "crypto-browserify";
// const crypto =require("crypto-browserify")
import sjcl from 'sjcl';
import "./Challenges.css";
import { useFile } from "../../context/index";
import axios from "axios";


const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0NjhkMTgxMS1lOGI1LTQzZDUtYTg4OS0xYjliZWI1NjgzNTkiLCJlbWFpbCI6ImlpdDIwMjAxMDNAaWlpdGEuYWMuaW4iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOWFhMDdkOTBmNTc0NWRiOTQ2ODEiLCJzY29wZWRLZXlTZWNyZXQiOiI2ZDQxOWQ2MzBiZDkwODBhNWFhNGJmZDAyOGViNDM2MWIzNDEwNmRiYzJlMDU0YTZjZDVhM2NjMDRiNDg3MDllIiwiaWF0IjoxNjc5ODUxODMzfQ.-f10NGa3eB6SzzuXXxU-w4p450Bhourg9xJEJURqpgo`;


import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { Alert } from "bootstrap";

const Challenges = ({ challenges, device, ipfs, user }) => {

  console.log(ipfs);

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

  const [Url,setUrl]=useState();
  const [loading, setLoading] = useState(false);

const download = async()=>{
  const baseURL = `https://gateway.pinata.cloud/ipfs/`;
    const URL = `${baseURL}${ipfs}`;
    setUrl(URL);
    // downloadFun(URL);
    console.log("before");
    const data = await newDownloadByUserFunction(user[3], ipfs);
    console.log(data.receipt);

    if (data.receipt) {
      console.log("test: ", URL);
      window.location.replace(URL);
    }
}
  const handleDownloadAllChallenges = () => {
    const challengesText = challenges.join("\n");
    const blob = new Blob([challengesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "challenges.txt";
    link.click();
  };

  const handleUploadResponseFile = async (event) => {
    const file = event.target.files[0];
    const respHash = await getIPFSHash(file);
    console.log(respHash);
    console.log(device[1]);
    if(respHash === device[1]){
      download();
    }
    else{
      alert("Please try again..");
    }
  };


  const getIPFSHash = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "File name",
    });

    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      setLoading(true); // Set loading to true when starting the request
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
    } finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };

  return (
    <MDBContainer style={{ maxWidth: "1200px" }}>
      <MDBCard
        className="bg-white my-5 mx-auto"
        style={{ borderRadius: "1rem", maxWidth: "1000px" }}
      >
        <MDBCardBody className="p-5 w-100 d-flex flex-column">
          <h2 className="fw-bold mb-2 text-center ">PUF Authentication</h2>

          {challenges.map((challenge, index) => (
    <MDBRow className="mb-5" key={index}>
      <MDBCol className="challengeBox" style={{ backgroundColor: "#D4ADFC" }}>

        <h4 className="mb-2 text-center">Challenge {index+1}</h4>
      </MDBCol>
      <MDBCol className="challengeBox ">
        <h4 className="mb-2 text-center">{challenge}</h4>
      </MDBCol>
    </MDBRow>
  ))}
          
<MDBRow className="mb-3">

<MDBCol>
<button
className="btn btn-primary"
                onClick={handleDownloadAllChallenges}>
            Download Challenges
          </button>
</MDBCol>
        <MDBCol>
  <button
    className="btn btn-primary"
    onClick={() => document.getElementById("uploadResponseFile").click()}
  >
    Upload Responses
  </button>
  <input
    type="file"
    id="uploadResponseFile"
    accept=".txt"
    onChange={handleUploadResponseFile}
    style={{ display: "none" }}
  />
</MDBCol>

      </MDBRow>

        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Challenges;