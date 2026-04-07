import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      display:"flex",
      justifyContent:"space-between",
      padding:"15px",
      background:"#111",
      color:"white"
    }}>

      <h2>Deepfake Detector</h2>

      <div>
        <Link to="/" style={{color:"white", marginRight:"20px"}}>Home</Link>
        <Link to="/register" style={{color:"white"}}>Register</Link>
      </div>

    </nav>
  );
}

export default Navbar;