import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

const ChatbotMessage = ({ message }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + message.text[currentIndex]);
      currentIndex++;
      if (currentIndex === message.text.length) clearInterval(intervalId);
    }, 50);

    return () => clearInterval(intervalId);
  }, [message.text]);

  return (
    <Box
      display="flex"
      justifyContent={message.sender === "user" ? "flex-end" : "flex-start"}
    >
      <Typography
        variant="body1"
        sx={{
          padding: 1,
          borderRadius: 1,
          bgcolor: message.sender === "user" ? "primary.light" : "grey.200",
        }}
      >
        {displayedText}
      </Typography>
    </Box>
  );
};

export default ChatbotMessage;
