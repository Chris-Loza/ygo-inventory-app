import React, { useState } from "react";
import "./homepage.css";
import Inventory from "./inventory/Inventory";
import CardDetails from "../cardDetails/CardDetails.jsx";
import Details from "./details/Details.jsx";

const Homepage = () => {
  const [inventoryMode, setInventoryMode] = useState(false);

  const handleSwitch = () => {
    setInventoryMode(!inventoryMode);
  };

  return (
    <div className="homepage">
      {/* <div className="myLinks">Created and Developed by Christian Loza </div> */}
      <div className="toggleSwitch">
        <input type="checkbox" name="inventory" onClick={handleSwitch} />
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
        <div className="utilities">
          <Details />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
