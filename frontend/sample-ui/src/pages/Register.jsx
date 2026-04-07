import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setFormData({
          username: "",
          email: "",
          password: ""
        });
      } else {
        alert(data.error || "Registration Failed");
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

        <h2 style={{textAlign:"center"}}>Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{width:"100%", padding:"10px", margin:"10px 0"}}
        />

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
            background:"#28a745",
            color:"white",
            border:"none",
            borderRadius:"5px",
            cursor:"pointer"
          }}
        >
          Register
        </button>

        <p style={{textAlign:"center", marginTop:"15px"}}>
          Already have an account?{" "}
          <Link to="/login" style={{color:"blue", fontWeight:"bold"}}>
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Register;