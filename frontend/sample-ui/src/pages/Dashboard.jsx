import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  // get username from localStorage
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div style={{textAlign:"center", marginTop:"100px"}}>
      <h1>Welcome to Dashboardsathvik🎉</h1>

      <button
        onClick={handleLogout}
        style={{
          padding:"10px 20px",
          background:"red",
          color:"white",
          border:"none",
          borderRadius:"5px",
          marginTop:"20px",
          cursor:"pointer"
        }}
      >
        Do the Logout 
      </button>
    </div>
  );
}

export default Dashboard;