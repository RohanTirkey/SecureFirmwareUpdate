import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import Challenges from "./Challenges";

const validate = ({ ipfs, user }) => {
  const [challenges, setChallenges] = useState([]);

  const location = useLocation();
  const { device } = location.state;


  useEffect(() => {
    const fetchIPFSContent = async () => {
      const baseURL = "https://gateway.pinata.cloud/ipfs/";
      const chalIpfs = device[0];
      const url = `${baseURL}${chalIpfs}`;

      try {
        console.log(url);
        const response = await fetch(url);
        if (response.ok) {
          const content = await response.text();
          const challengesArray = content.split("\n");
          setChallenges(challengesArray);
          console.log("IPFS content:", content);
          console.log(challengesArray);
          // Do something with the content
        } else {
          console.error("Error fetching IPFS content:", response.status);
        }
      } catch (error) {
        console.error("Error fetching IPFS content:", error);
      }
    };

    fetchIPFSContent();
  }, [ipfs]);

  return (
    <div>
      <Challenges challenges={challenges} device={device} ipfs={ipfs} user={user} />
    </div>
  );
};

export default validate;
