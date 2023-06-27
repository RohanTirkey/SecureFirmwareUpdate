import react, { useState, useEffect, useContext } from "react";
import "./fileUpload.css";
import img from "./img.webp";
import axios from "axios";
import { useFile } from "../../context/index";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import PacmanLoader from "react-spinners/PacmanLoader";

const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0NjhkMTgxMS1lOGI1LTQzZDUtYTg4OS0xYjliZWI1NjgzNTkiLCJlbWFpbCI6ImlpdDIwMjAxMDNAaWlpdGEuYWMuaW4iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOWFhMDdkOTBmNTc0NWRiOTQ2ODEiLCJzY29wZWRLZXlTZWNyZXQiOiI2ZDQxOWQ2MzBiZDkwODBhNWFhNGJmZDAyOGViNDM2MWIzNDEwNmRiYzJlMDU0YTZjZDVhM2NjMDRiNDg3MDllIiwiaWF0IjoxNjc5ODUxODMzfQ.-f10NGa3eB6SzzuXXxU-w4p450Bhourg9xJEJURqpgo`;
const apiKey = "1f0e15b676bd017973c63d02648af633e2ee1c3e6fc1d303743913d94c0dfcb0";

const FileUpload = ({ user, isAdmin }) => {
  const [file, setFile] = useState(null);
  const [displayImg, setDisplayImg] = useState("none");

  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [URL, setURL] = useState("");
  const [filesData, setFilesData] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUloaded, setIsUploaded] = useState(false);
  const [PUF, setPUF] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [UploadedFile, setUploadedFile] = useState(null);
  const [devices,setDevices] = useState([]);

  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ipfsHash != "") {
      callHandler();
    }
  }, [ipfsHash]);

  useEffect(() => {
  const fetchDevices = async () => {
    try {
      console.log(user[4]);
      const devices = await getDevicesByMId(user[4]);
      console.log(devices);
      // Set the devices to populate the dropdown options
      setDevices(devices);
    } catch (error) {
      console.log(error);
    }
  };

  fetchDevices();
}, []);

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

  console.log("FileUpload: "+address);

  const PUFHandler = (e) => {
    setPUF(e.target.value);
    console.log(e.target.value);
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
    console.log(selectedOption);
  };

  // Function to handle file upload
  const handleFileUpload = async (event) => {
    setFile(event.target.files[0]);
    try {
        const scanResult = await performFileScan(file);
        console.log(scanResult);
        setScanResult(scanResult);
        setError(null); // Reset the error state
      } catch (error) {
        setError(error);
        setScanResult(null); // Reset the scan result state
      }
      if(error) {
        console.log("Not safe")
      } else {
        console.log("Safe")
      }
  };

  const performFileScan = async (file) => {
      const url = "https://www.virustotal.com/api/v3/files";
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-apikey": apiKey
        }
      });
  
      return response.data;
    };

  const handleSubmission = async () => {
    setFileName(file.name);

    setFileSize(file.size);

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;
    setDate(currentDate);

    let currentTime = new Date().toLocaleTimeString();

    setTime(currentTime);

    let temp = file.name.split(".");
    temp = temp[temp.length - 1];
    setFileType(temp);

    console.log(temp, currentDate);

    const formData = new FormData();
    console.log();
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
      console.log(res.data.IpfsHash);
      setIpfsHash(res.data.IpfsHash);
    } catch (error) {
      console.log(error);
    }

    setIsUploaded(false);
  };


  const changeImage = (e) => {
    setFile(e.target.files[0]);
    setDisplayImg("block");
    setIsUploaded(true);
    toast("Please Insert PUF Key..");
  };

  const callHandler = async () => {
    let data = await addFileFunction(
      address,
      ipfsHash,
      fileName,
      fileType,
      date,
      time,
      fileSize,
      selectedOption
    );

    console.log(data);
    console.log(selectedOption);
    setLoading(false);
    // setUploaded(true);

    if (data.receipt) toast("file Uploaded successfully");
    else toast("Please try again....");

    setIpfsHash("");
    setDisplayImg("none");
  };

  const notAdmin = () => {
    navigate("/");
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

      {!isAdmin && notAdmin()}

      {loading ? (
        <PacmanLoader color="#36d7b7" className="loader" size="50px" />
      ) : (
        <div className="fileUpload">
          <div className="total">
            <div className="aboutUs">
              Welcome to the file upload page for admin. Here, you can securely
              upload firmware files and provide a unique public key for users to
              access them. Thank you for your contribution to our secure
              firmware file storage.
            </div>

            <div className="right">
              <div className="input">
                <img
                  src={img}
                  alt="loading..."
                  style={{
                    height: "200px",
                    width: "300px",
                    display: displayImg,
                  }}
                  className="img"
                />

                <div className="form-group">
                <select className="form-control" value={selectedOption} onChange={handleDropdownChange}>
                <option value="">Select Device</option>
                {devices && devices.map((device) => (
                  <option value={device.DeviceId} key={device.DeviceIdDeviceId}>{device.DeviceId}</option>
                  ))}
                </select>
                </div>


                <div>
              <label className="label">
                  {"Choose A File"}

                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="inputItem"
                  />
                </label>
                <button type="submit" onClick={handleSubmission}>Upload</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileUpload;