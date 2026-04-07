import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Prediction() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Send to backend API. Use absolute address so front-end dev server (5173) hits backend (8000).
      const response = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // show backend error text (e.g., no file, decode failure, inference failed)
        throw new Error(data.error || "Prediction failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "An error occurred during prediction");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Deepfake Detection</h1>

      <div
        style={{
          border: "2px dashed #007bff",
          borderRadius: "8px",
          padding: "30px",
          textAlign: "center",
          backgroundColor: "#f8f9fa",
          marginBottom: "20px",
        }}
      >
        <input
          type="file"
          id="fileInput"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label
          htmlFor="fileInput"
          style={{
            cursor: "pointer",
            fontSize: "16px",
            color: "#007bff",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "32px" }}>📁</span>
          </div>
          Click to upload or drag and drop
        </label>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
          Supported formats: PNG, JPG, MP4, AVI (Max: 100MB)
        </p>
      </div>

      {preview && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}

      {file && (
        <div style={{ fontSize: "14px", marginBottom: "20px", color: "#333" }}>
          <strong>Selected file:</strong> {file.name}
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "5px",
            marginBottom: "20px",
            borderLeft: "4px solid #721c24",
          }}
        >
          Error: {error}
        </div>
      )}

      {result && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            borderLeft: "4px solid #155724",
          }}
        >
          <h3>Prediction Result</h3>
          <p>
            <strong>Classification:</strong>{" "}
            {result.prediction === "fake" ? "🚨 DEEPFAKE" : "✅ REAL"}
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            {(result.confidence * 100).toFixed(2)}%
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          style={{
            padding: "12px 30px",
            fontSize: "16px",
            background: loading || !file ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading || !file ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Predict"}
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: "12px 30px",
            fontSize: "16px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default Prediction;
