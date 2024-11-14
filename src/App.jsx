import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CssBaseline, Container, Grid, Box } from "@mui/material";
import { Experience } from "./components/Experience";
import Chatbot from "./components/Chatbot";

function App() {
  const audio = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeakChange = (speaking) => {
    setIsPlaying(speaking);
  };

  return (
    <Container maxWidth="lg" sx={{ height: "100vh", display: "flex" }}>
      <CssBaseline />
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {/* Left Side: Chatbot */}
        <Grid item xs={12} md={6} sx={{ height: "100%" }}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Chatbot onSpeakChange={handleSpeakChange} />
          </Box>
        </Grid>

        {/* Right Side: 3D Avatar */}
        <Grid item xs={12} md={6} sx={{ height: "100%" }}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "#ffffff",
            }}
          >
            <Canvas
              shadows
              camera={{
                position: [0, 0, 5],
                fov: 8.5,
              }}
              style={{ height: "100%", width: "100%" }}
            >
              <Experience isAudioPlaying={isPlaying} />
            </Canvas>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
