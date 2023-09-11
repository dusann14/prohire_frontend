import React from "react";
import "../style/Loader.css";

function Loader() {
  return (
    <div className="loading">
      <p>Loading...</p>
      <div className="spinner"></div>
    </div>
  );
}

export default Loader;
