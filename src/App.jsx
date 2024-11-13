// App.jsx
import { Canvas } from "@react-three/fiber";
import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "./components/Avatar";
import { Environment, OrbitControls, useTexture } from "@react-three/drei";

function App() {
  const audio = useRef(null); // Reference to the audio element
  const [isPlaying, setIsPlaying] = useState(false); // State to control button text

  useEffect(() => {
    // Load the audio file
    audio.current = new Audio("/audio/pizzas.mp3");

    // Reset button state when audio ends
    audio.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    return () => {
      // Clean up event listener on component unmount
      audio.current.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  // Toggle Play/Pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audio.current.pause();
      setIsPlaying(false);
    } else {
      audio.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <button
        onClick={togglePlayPause}
        style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1 }}
      >
        {isPlaying ? "Stop" : "Start"} Lip Sync
      </button>
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
        <OrbitControls />
        <Avatar position={[0, -3, 2]} scale={2} isAudioPlaying={isPlaying} />
        <Environment preset="sunset" />
      </Canvas>
    </>
  );
}

export default App;
