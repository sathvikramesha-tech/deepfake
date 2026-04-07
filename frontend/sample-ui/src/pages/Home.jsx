import React from "react";

function Home() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Deepfake Detection Platform</h1>

      <p>
        Upload videos or images and detect whether they are Real or Deepfake
        using AI.
      </p>

      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Start Detection
      </button>
    </div>
  );
}

export default Home;