import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok && data.message) {
        localStorage.setItem("username", data.username);
        alert(data.message + " Welcome " + data.username);

        // redirect to prediction page
        navigate("/predict");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div style={{display:"flex", justifyContent:"center", marginTop:"50px"}}>
      <form
        onSubmit={handleSubmit}
        style={{
          width:"350px",
          padding:"20px",
          border:"1px solid #ccc",
          borderRadius:"10px"
        }}
      >

        <h2 style={{textAlign:"center"}}>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{width:"100%", padding:"10px", margin:"10px 0"}}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{width:"100%", padding:"10px", margin:"10px 0"}}
        />

        <button
          type="submit"
          style={{
            width:"100%",
            padding:"10px",
            background:"#007bff",
            color:"white",
            border:"none",
            borderRadius:"5px",
            cursor:"pointer"
          }}
        >
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;