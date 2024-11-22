import React, { useState } from "react";
import "./homepage.css";
import Inventory from "./inventory/Inventory.jsx";
import CardDetails from "../cardDetails/CardDetails.jsx";
import Details from "./details/Details.jsx";
import UserInfo from "./user/UserInfo.jsx";
import MusicPlayer from "../musicPlayer/MusicPlayer.jsx";

const Homepage = () => {
  const [inventoryMode, setInventoryMode] = useState(false);

  const handleSwitch = () => {
    setInventoryMode(!inventoryMode);
  };

  return (
    <div className="homepage">
      <div className="toggleSwitch">
        <input type="checkbox" name="inventory" onClick={handleSwitch} />
      </div>
      <div className="musicPlayerContainer">
        <MusicPlayer />
      </div>
      {inventoryMode ? (
        <div className="inventoryMode">
          <Inventory />
        </div>
      ) : (
        <div className="cardDetailsContainer">
          <CardDetails />
        </div>
      )}
      <div className="mainSeparator"></div>
      <div className="details">
        <div className="utilitiesContainer">
          <Details />
        </div>
        <div className="userDisplay">
          <UserInfo />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
