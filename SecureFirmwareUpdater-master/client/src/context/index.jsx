import React, { useContext, createContext, useEffect, useState } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk";

const FileContext = createContext();

const FileProvider = ({ children }) => {
  const [fileData, setfileData] = useState([]);
  const [fileDataforManufacture, setfileDataforManufacture] = useState([]);
  const [fileDataForDevice, setfileDataforDevice] = useState([]);
  const [PUF, setPUF] = useState("");

  const { contract } = useContract(
    "0x88EfDFedB123354a7097D3eD70B81a07D39F7a6C"
  );

  useEffect(() => {
    if (contract) {
      getFilesFunction();
    }
  }, [contract]);

  const PUFgetter = (PUFKEY) => {
    setPUF(PUFKEY);
    console.log(PUF);
  };

  const { mutateAsync: addFile, isLoading } = useContractWrite(
    contract,
    "addFile"
  );

  const { mutateAsync: newDownloadByUser, isLoading2 } = useContractWrite(
    contract,
    "newDownloadByUser"
  );

  const { mutateAsync: adminAdd, isLoading4 } = useContractWrite(
    contract,
    "adminAdd"
  );

  const { mutateAsync: addDevice, isLoading3 } = useContractWrite(
    contract,
    "addDevice"
  );

  const address = useAddress();
  const connect = useMetamask();

  const addFileFunction = async (
    address,
    ipfsHash,
    fileName,
    fileType,
    date,
    time,
    fileSize,
    deviceId
  ) => {
    try {
      console.log(ipfsHash, fileName, fileType, date, time, fileSize, deviceId);
      await connect();
      console.log("address...", address);
      const data = await addFile([
        address,
        ipfsHash,
        fileName,
        fileType,
        date,
        time,
        fileSize,
        deviceId,
      ]);

      console.info("contract call successs", data);
      return data;
    } catch (err) {
      console.error("contract call failure", err);
      return err;
    }
  };

  const addDevices = async (_ChallengeHash, _ResponseHash, _DeviceId, _mId) => {
    try {
      await connect();
      const data = await addDevice([
        _ChallengeHash,
        _ResponseHash,
        _DeviceId,
        _mId,
      ]);

      console.info("contract call successs", data);
      return data;
    } catch (err) {
      console.error("contract call failure", err);
      return err;
    }
  };

  const getFilesByDeviceId = async (deviceId) => {
    const filedata = await contract.call("getfiles",deviceId);
    console.log(filedata);
    setfileDataforDevice([...filedata]);
    return filedata;
  };

  const getDevicesByMId = async (mId) => {
    const filedata = await contract.call("getDevices", mId);
    // console.log(filedata);
    setfileDataforManufacture([...filedata]);
    return filedata;
  };

  const getFilesFunction = async () => {
    const filedata = await contract.call("getFiles");
    setfileData([...filedata]);
    return filedata;
  };

  const isAdminFunction = async (address) => {
    const isadmin = await contract.call("isAdmin", address);
    console.log("admin:", isadmin);
    return isadmin;
  };

  const signInFunction = async (address) => {
    await connect();
    const signin = await contract.call("signIn", address);
    console.log("signin:", signin);
    return signin;
  };

  const signUpFunction = async (
    address,
    name,
    userName,
    email,
    isadmin,
    mId
  ) => {
    try {
      await connect();
      const data = await contract.call(
        "signUp",
        address,
        name,
        userName,
        email,
        isadmin,
        mId
      );

      console.info("contract call successs..", data);
      return data;
    } catch (err) {
      console.error("contract call failure", err);
      return err;
    }
  };

  const filesUploadedbyAdmin = async (address) => {
    const files = await contract.call("uploadedbyAdmin", address);
    console.log(files);
    return files;
  };

  const filesdownloadedbyUser = async (address) => {
    const files = await contract.call("downloadedbyUser", address);
    console.log(files);

    return files;
  };

  const newDownloadByUserFunction = async (address, ipfs) => {
    try {
      await connect();
      const data = await newDownloadByUser([address, ipfs]);
      console.info("contract call successs", data);
      return data;
    } catch (err) {
      console.error("contract call failure", err);
      return err;
    }
  };

  const adminAddFunction = async (prev, newAdmin) => {
    try {
      await connect();
      const data = await adminAdd([prev, newAdmin]);
      console.info("contract call successs", data);
      return data;
    } catch (err) {
      console.error("contract call failure", err);
      return err;
    }
  };

  return (
    <FileContext.Provider
      value={{
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
        PUF,
        PUFgetter,
        addDevices,
        getFilesByDeviceId,
        getDevicesByMId,
        fileDataforManufacture,
        fileDataForDevice,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

const useFile = () => {
  return useContext(FileContext);
};

export { FileProvider, useFile };
