import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  CssBaseline,
  Container,
  Grid,
  Box,
  IconButton,
  Pagination,
} from "@mui/material";
import { Experience } from "./Experience";
import { FemaleExp } from "./FemaleExp";
import Chatbot from "./Chatbot";
import WebcamComponet from "./WebcamComponent";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";
import { Typography } from "@mui/material";

function MainAvatar() {
  const audio = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingFemale, setIsPlayingFemale] = useState(false);
  const [isPlayingMale, setIsPlayingMale] = useState(false);
  const [botResponse, setBotResponse] = useState("");
  const [chatbotLayoutOpen, setChatbotLayoutOpen] = useState(false);

  const handleBotResponse = (response) => {
    console.log("Bot Response:", response);
    setBotResponse(response);
  };

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
  const [layoutOption, setLayoutOption] = useState(1);

  const handleFeedbackToggle = () => {
    setIsFeedbackOpen(!isFeedbackOpen);
  };

  const handleFeedbackChange = (newFeedback) => {
    if (feedback !== newFeedback) {
      setFeedback(newFeedback ?? ""); // Default to empty string if undefined
    }
  };

  useEffect(() => {
    if (feedback && feedback.length > 0) {
      const formattedTranscript = formatResponse(feedback);
      setDisplayText(formattedTranscript);
    } else {
      setDisplayText("");
    }
  }, [feedback]);

  useEffect(() => {
    if (displayText.length === feedback.length) {
      console.log("Final Display Text:", displayText);
    }
  }, [displayText]);

  const formatResponse = (response) => {
    const headers = response
      .replace(/(######\s?)(.*?)\n/g, "<h6>$2</h6>")
      .replace(/(#####\s?)(.*?)\n/g, "<h5>$2</h5>")
      .replace(/(####\s?)(.*?)\n/g, "<h4>$2</h4>")
      .replace(/(###\s?)(.*?)\n/g, "<h3>$2</h3>")
      .replace(/(##\s?)(.*?)\n/g, "<h2>$2</h2>")
      .replace(/(#\s?)(.*?)\n/g, "<h1>$2</h1>");

    const withBold = headers.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    const formattedResponse = withBold.replace(/\n/g, "<br />");

    console.log("Formatted Response:", formattedResponse); // Add this line

    return formattedResponse;
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "hidden",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Centered Heading */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Critical Conversation Training
      </Typography>

      <Container
        maxWidth={false}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          margin: 0,
          overflow: "hidden",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            height: "100%",
            overflow: "hidden",
            margin: 0,
            width: "100%",
          }}
        >
          {/* First Grid (Static) */}
          <Grid item xs={12} md={4} sx={{ height: "95%" }}>
            <Box
              sx={{
                height: "98%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                padding: 2,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
                border: "1px solid lightslategray",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  margin: 0,
                  padding: 0,
                  lineHeight: 0.8,
                }}
              >
                Team Member Manisha
              </Typography>
              <Box
                sx={{
                  height: "70%",
                  width: "90%", // Ensures full width
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
                    position: [0, 0, 4.5],
                    fov: 5,
                  }}
                  style={{ height: "100%", width: "100%" }}
                >
                  {/* Your component for the canvas */}
                  <FemaleExp isAudioPlaying={isPlayingFemale} />
                </Canvas>
              </Box>
              <Box
                sx={{
                  height: "30%",
                  width: "90%", // Ensures full width
                  display: "flex",
                  padding: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: "#f5f5f5",
                  overflowY: "scroll",
                  scrollbarWidth: "none", // For Firefox
                  "&::-webkit-scrollbar": {
                    display: "none", // For Chrome, Safari, and Edge
                  },
                }}
              >
                {botResponse.length > 0 ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatResponse(botResponse),
                    }}
                  />
                ) : (
                  "Manisha's Response will be displayed here"
                )}
              </Box>
            </Box>
          </Grid>

          {/* Second Grid (Chat and Webcam) */}
          <Grid
            item
            xs={12}
            md={isFeedbackOpen ? 3.5 : 5.5}
            sx={{
              height: "98%",
              position: "relative",
            }}
          >
            {/* Pagination in top-right corner */}
            <Box
              sx={{
                position: "absolute",
                top: 20,
                right: 10,
                zIndex: 10,
              }}
            >
              <Pagination
                count={3}
                page={layoutOption}
                onChange={(event, value) => setLayoutOption(value)}
                size="small"
              />
            </Box>

            <Box
              sx={{
                height: "95%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                padding: 2,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
                border: "1px solid lightslategray",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  margin: 0,
                  padding: 0,
                  lineHeight: 0.8,
                }}
              >
                User Window
              </Typography>
              {/* Conditionally rendered components based on layoutOption */}
              {layoutOption === 1 && (
                <>
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
                      height: "75%",
                      boxShadow: 1,
                      borderRadius: 2,
                      overflow: "auto",
                      backgroundColor: "white",
                      overflow: "hidden",
                    }}
                  >
                    <Chatbot
                      onResponseChange={handleBotResponse}
                      onSpeakChange={(speaking, avatar) =>
                        handleSpeakChange(speaking, avatar)
                      }
                      onFeedbackChange={handleFeedbackChange}
                    />
                  </Box>
                </>
              )}

              {layoutOption === 2 && (
                <>
                  <Box
                    sx={{
                      width: "100%",
                      height: "75%",
                      boxShadow: 1,
                      borderRadius: 2,
                      overflow: "auto",
                      backgroundColor: "white",
                      overflow: "hidden",
                    }}
                  >
                    <Chatbot
                      onSpeakChange={(speaking, avatar) =>
                        handleSpeakChange(speaking, avatar)
                      }
                      onFeedbackChange={handleFeedbackChange}
                    />
                  </Box>

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
                </>
              )}

              {layoutOption === 3 && (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
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
              )}
            </Box>
          </Grid>

          {/* Third Grid (Feedback Sidebar) */}
          <Grid
            item
            xs={12}
            md={isFeedbackOpen ? 4.5 : 2.5}
            sx={{
              height: "97%",
              cursor: "pointer",
              transition: "width 0.3s ease",
              position: "relative",
            }}
            onClick={handleFeedbackToggle}
          >
            <Box
              sx={{
                height: "96%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                padding: 2,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
                border: "1px solid lightslategray",
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

              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  margin: 0,
                  padding: 0,
                  lineHeight: 0.8,
                }}
              >
                Feedback Coach
              </Typography>

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
                    ""
                  )}
                </div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default MainAvatar;
