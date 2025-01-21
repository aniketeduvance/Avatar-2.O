import React, { useState, useRef, useEffect } from "react";

const WebcamComponent = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setError("");
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
      streamRef.current = null;

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setIsStreaming(false);
    }
  };

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
            src="/images/user-interface.jpg"
            alt="Camera Placeholder"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              backgroundColor: "#f1f5f9",
            }}
          />
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            display: isStreaming ? "block" : "none",
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
