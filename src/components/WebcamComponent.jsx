import React, { useState, useRef, useEffect } from "react";

const WebcamComponent = () => {
  const [isStreaming, setIsStreaming] = useState(false); // Tracks if the camera is streaming
  const [error, setError] = useState(""); // Error messages
  const videoRef = useRef(null); // Reference to the video element
  const streamRef = useRef(null); // Reference to the media stream

  const startWebcam = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        // Bind the stream to the video element
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true); // Update state to indicate streaming started
        setError(""); // Clear any existing error messages
      }
    } catch (err) {
      setError(
        "Unable to access the webcam. Please ensure camera permissions are granted."
      );
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      // Stop all video tracks
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null; // Clear the stream reference

      if (videoRef.current) {
        videoRef.current.srcObject = null; // Detach the stream from the video element
      }

      setIsStreaming(false); // Update state to indicate streaming stopped
    }
  };

  // Cleanup when the component is unmounted
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
        height: "100%",
        padding: "0.5rem",
      }}
    >
      <div
        style={{
          position: "relative",
          flex: "1",
          height: "100%",
          backgroundColor: "#f1f5f9",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {error && (
          <div
            style={{
              position: "absolute",
              top: "0.5rem",
              left: "0.5rem",
              right: "0.5rem",
              padding: "0.5rem",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              borderRadius: "4px",
              fontSize: "0.875rem",
              zIndex: 10,
            }}
          >
            {error}
          </div>
        )}

        {/* Placeholder Image */}
        {!isStreaming && (
          <img
            src="/user-interface.jpg" // Replace with the actual image path
            alt="Camera Placeholder"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              backgroundColor: "#f1f5f9",
            }}
          />
        )}

        {/* Video Element */}
        <video
          ref={videoRef} // Bind the video element to the ref
          autoPlay
          playsInline
          style={{
            display: isStreaming ? "block" : "none", // Show only when streaming
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      <button
        onClick={isStreaming ? stopWebcam : startWebcam}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: isStreaming ? "#dc2626" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          fontSize: "0.875rem",
          minWidth: "fit-content",
        }}
      >
        {isStreaming ? "Stop Camera" : "Start Camera"}
      </button>
    </div>
  );
};

export default WebcamComponent;
