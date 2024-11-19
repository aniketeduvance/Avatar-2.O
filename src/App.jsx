import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { CssBaseline, Container, Grid, Box, IconButton } from "@mui/material";
import { Experience } from "./components/Experience";
import { FemaleExp } from "./components/FemaleExp";
import Chatbot from "./components/Chatbot";
import WebcamComponet from "./components/WebcamComponent";
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // Material-UI icon
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"; // Material-UI icon
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";

function App() {
  const audio = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingFemale, setIsPlayingFemale] = useState(false);
  const [isPlayingMale, setIsPlayingMale] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [displayText, setDisplayText] = useState("");
  const handleSpeakChange = (speaking, avatar) => {
    if (avatar === "female") {
      setIsPlayingFemale(speaking);
    } else if (avatar === "male") {
      setIsPlayingMale(speaking);
    }
  };

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleFeedbackToggle = () => {
    setIsFeedbackOpen(!isFeedbackOpen);
  };

  const handleFeedbackChange = (newFeedback) => {
    setFeedback(newFeedback);
  };

  useEffect(() => {
    if (feedback.length > 0) {
      const formattedTranscript = formatResponse(feedback);
      let index = 0;

      const intervalId = setInterval(() => {
        setDisplayText((prev) => prev + formattedTranscript[index]);
        index++;
        if (index === formattedTranscript.length) {
          clearInterval(intervalId);
          setFeedback(""); // Clear feedback after rendering
        }
      }, 1);

      return () => clearInterval(intervalId); // Cleanup interval
    }
  }, [feedback]);

  const formatResponse = (response) => {
    // Replace markdown-like headers with HTML headers
    const headers = response
      .replace(/(######\s?)(.*?)\n/g, "<h6>$2</h6>")
      .replace(/(#####\s?)(.*?)\n/g, "<h5>$2</h5>")
      .replace(/(####\s?)(.*?)\n/g, "<h4>$2</h4>")
      .replace(/(###\s?)(.*?)\n/g, "<h3>$2</h3>")
      .replace(/(##\s?)(.*?)\n/g, "<h2>$2</h2>")
      .replace(/(#\s?)(.*?)\n/g, "<h1>$2</h1>");

    // Handle bold text (**text**) correctly
    const withBold = headers.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // Replace newline characters with <br /> for proper formatting
    const formattedResponse = withBold.replace(/\n/g, "<br />");

    return formattedResponse;
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "98vh",
        display: "flex",
        padding: 3,
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
          height: "100%",
        }}
      >
        {/* First Grid (Static) */}
        <Grid item xs={12} md={4} sx={{ height: "100%" }}>
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
            <Canvas
              shadows
              camera={{
                position: [0, 0, 12],
                fov: 5,
              }}
              style={{ height: "100%", width: "100%" }}
            >
              {/* Your component for the canvas */}
              <FemaleExp isAudioPlaying={isPlayingFemale} />
            </Canvas>
          </Box>
        </Grid>

        {/* Second Grid (Chat and Webcam) */}
        <Grid
          item
          xs={12}
          md={isFeedbackOpen ? 3.5 : 5.5}
          sx={{ height: "100%" }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              padding: 2,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "30%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: "white",
                overflow: "hidden",
              }}
            >
              {/* Webcam component */}
              <WebcamComponet />
            </Box>

            <Box
              sx={{
                width: "100%",
                height: "70%",
                boxShadow: 1,
                borderRadius: 2,
                overflow: "auto",
                backgroundColor: "white",
              }}
            >
              <Chatbot
                onSpeakChange={(speaking, avatar) =>
                  handleSpeakChange(speaking, avatar)
                }
                onFeedbackChange={handleFeedbackChange}
              />
            </Box>
          </Box>
        </Grid>

        {/* Third Grid (Feedback Sidebar) */}
        <Grid
          item
          xs={12}
          md={isFeedbackOpen ? 4.5 : 2.5}
          sx={{
            height: "100%",
            cursor: "pointer",
            transition: "width 0.3s ease",
            position: "relative",
          }}
          onClick={handleFeedbackToggle}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              padding: 2,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            {/* Expand/Collapse Button */}
            <IconButton
              onClick={handleFeedbackToggle}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
                backgroundColor: "white",
                boxShadow: 1,
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              {isFeedbackOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>

            {/* Feedback Canvas */}
            <Box
              sx={{
                width: "100%",
                height: "30%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 1,
                borderRadius: 2,
                backgroundColor: "white",
              }}
            >
              <Canvas
                shadows
                camera={{
                  position: [0, 0, 4.5],
                  fov: 5.8,
                }}
                style={{ height: "100%", width: "100%" }}
              >
                {/* Your component for the canvas */}
                <Experience isAudioPlaying={isPlayingMale} />
              </Canvas>
            </Box>

            {/* Feedback Window */}
            <Box
              sx={{
                width: "100%",
                height: "70%",
                boxShadow: 1,
                borderRadius: 2,
                overflow: "auto",
                backgroundColor: "white",
              }}
            >
              <div
                style={{
                  margin: "auto",
                  display: "block",
                  padding: "1rem",
                }}
              >
                <h3>Feedback Window</h3>
                {displayText.length > 0 ? (
                  <div dangerouslySetInnerHTML={{ __html: displayText }} />
                ) : (
                  "Feedback will be displayed here"
                )}
              </div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
