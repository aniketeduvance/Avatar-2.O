import React, { useState, useEffect, useRef } from "react";
import { Button, TextField, Box } from "@mui/material";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const apiUrl =
  "https://6c65myswq3qrewtyhg4vokkvvi0lewxd.lambda-url.ap-south-1.on.aws/";

export default function Chatbot({
  onSpeakChange,
  onFeedbackChange,
  onResponseChange,
}) {
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [input, setInput] = useState("");
  const [previousResponse, setPreviousResponse] = useState("");
  const [showStartButton, setShowStartButton] = useState(true);
  const [currentPayload, setCurrentPayload] = useState({
    conversation_history_list: [],
    response: "",
    feedback: "",
    activity_4_1st_condition: true,
    activity_4_2nd_condition: false,
    evaluation_list: [],
    satisfaction_condition: false,
    count: 0,
    users_response: "",
  });
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [answerLoad, setAnswerLoad] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();

      // Try multiple common female voice names
      const englishFemaleVoice = availableVoices.find(
        (voice) =>
          voice.lang.startsWith("en") && // Match any English voice
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("victoria") ||
            voice.name.toLowerCase().includes("karen") ||
            voice.name.toLowerCase().includes("moira") ||
            voice.name.toLowerCase().includes("fiona"))
      );

      // If no specific female voice found, try Microsoft voices
      const microsoftFemaleVoice = availableVoices.find(
        (voice) =>
          voice.name.includes("Microsoft") &&
          voice.name.toLowerCase().includes("female")
      );

      // Fallback chain
      const selectedVoice =
        englishFemaleVoice ||
        microsoftFemaleVoice ||
        availableVoices.find((voice) => voice.lang.startsWith("en"));

      if (selectedVoice) {
        // console.log("Selected voice:", selectedVoice.name);
        setSelectedVoice(selectedVoice);
      } else {
        console.warn(
          "No suitable voice found. Available voices:",
          availableVoices.length
        );
      }
    };

    // Initial load
    loadVoices();

    // Setup event listener for voices changed
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Cleanup
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (message, isFeedback = false) => {
    const synth = window.speechSynthesis;

    if (!synth) {
      console.error("Speech synthesis not supported.");
      return;
    }

    // Define voice selectors
    const getFemaleVoice = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      return (
        availableVoices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            (voice.name.toLowerCase().includes("female") ||
              voice.name.toLowerCase().includes("samantha") ||
              voice.name.toLowerCase().includes("victoria") ||
              voice.name.toLowerCase().includes("karen") ||
              voice.name.toLowerCase().includes("moira") ||
              voice.name.toLowerCase().includes("fiona"))
        ) || availableVoices.find((voice) => voice.lang.startsWith("en"))
      );
    };

    const getIndianMaleVoice = () => {
      const availableVoices = window.speechSynthesis.getVoices();

      // Try to find Indian male voice
      const indianMaleVoice = availableVoices.find(
        (voice) =>
          voice.lang === "en-IN" && voice.name.toLowerCase().includes("male")
      );

      // If not found, fallback to a generic voice
      return (
        indianMaleVoice ||
        availableVoices.find((voice) => voice.lang === "en-IN") ||
        availableVoices[0]
      );
    };

    // Select voice based on message type
    const selectedVoice = isFeedback ? getIndianMaleVoice() : getFemaleVoice();

    if (!selectedVoice) {
      console.error("No suitable voice found. Using default system voice.");
      return;
    }

    const cleanedMessage = String(message).replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    );

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      onSpeakChange(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(cleanedMessage);
      utterance.voice = selectedVoice;

      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeakChange(false);
      };

      utterance.onerror = (error) => {
        console.error("Speech synthesis error:", error);
      };

      synth.speak(utterance);
      setIsSpeaking(true);
      onSpeakChange(true);
    }
  };

  const handleStart = async () => {
    setShowStartButton(false); // Hide the button
    setIsInputDisabled(false); // Enable the input field
    console.log("Handle Start is calling");

    // Reset the current payload for a fresh start
    const resetPayload = {
      conversation_history_list: [],
      response: "",
      feedback: "",
      activity_4_1st_condition: true,
      activity_4_2nd_condition: false,
      evaluation_list: [],
      satisfaction_condition: false,
      count: 0,
      users_response: "",
    };

    setCurrentPayload(resetPayload);
    console.log("Initial Payload before sending:", resetPayload);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetPayload),
      });

      const data = await response.json();
      console.log("First Response data:", data);

      // Add the previous response to the messages
      if (previousResponse) {
        const botMessage = {
          text: previousResponse, // Use the previous response
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }

      // Update the previous response with the current one
      setPreviousResponse(data.message?.response || "");
      if (data.message?.response) {
        onResponseChange(data.message.response);
      }

      // Handle voice and feedback logic
      const femaleVoiceDone = new Promise((resolve) => {
        if (data.message?.response) {
          console.log("Triggering female avatar lip-sync...");
          speak(data.message.response, false);
          onSpeakChange(true, "female");
          setTimeout(() => {
            console.log("Stopping female avatar lip-sync...");
            onSpeakChange(false, "female");
            resolve();
          }, Math.max(data.message.response.length * 100, 0));
        } else {
          resolve();
        }
      });

      femaleVoiceDone.then(() => {
        if (data.message?.feedback) {
          console.log("Triggering male avatar lip-sync...");
          speak(data.message.feedback, true);
          onSpeakChange(true, "male");
          setTimeout(() => {
            console.log("Stopping male avatar lip-sync...");
            onSpeakChange(false, "male");
          }, Math.max(data.message.feedback.length * 100, 0));
        }
      });

      setCurrentPayload((prevPayload) => ({
        ...prevPayload,
        ...data.message,
      }));
    } catch (error) {
      console.error("Error fetching intro message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, there was an error starting the chat.", sender: "bot" },
      ]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const updatedPayload = {
      ...currentPayload,
      conversation_history_list: [
        ...currentPayload.conversation_history_list,
        input,
      ],
    };

    try {
      setAnswerLoad(true);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      const data = await response.json();
      console.log("API Response:", data);

      // Add the previous response to the messages
      if (previousResponse) {
        const botMessage = {
          text: previousResponse, // Use the previous response
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }

      // Update the previous response with the current one
      setPreviousResponse(data.message?.response || "");
      if (data.message?.response) {
        onResponseChange(data.message.response);
      }

      const updatedFlags = {
        conversation_history_list:
          data.message.conversation_history_list ||
          currentPayload.conversation_history_list,
        activity_4_1st_condition:
          data.message.activity_4_1st_condition !== undefined
            ? data.message.activity_4_1st_condition
            : currentPayload.activity_4_1st_condition,
        activity_4_2nd_condition:
          data.message.activity_4_2nd_condition !== undefined
            ? data.message.activity_4_2nd_condition
            : currentPayload.activity_4_2nd_condition,
        satisfaction_condition:
          data.message.satisfaction_condition !== undefined
            ? data.message.satisfaction_condition
            : currentPayload.satisfaction_condition,
      };

      // Handle voice and feedback logic
      const femaleVoiceDone = new Promise((resolve) => {
        if (data.message?.response) {
          console.log("Triggering female avatar lip-sync...");
          speak(data.message.response, false);
          onSpeakChange(true, "female");
          setTimeout(() => {
            console.log("Stopping female avatar lip-sync...");
            onSpeakChange(false, "female");
            resolve();
          }, Math.max(data.message.response.length * 100, 0));
        } else {
          resolve();
        }
      });

      femaleVoiceDone.then(() => {
        if (data.message?.feedback) {
          console.log("Triggering male avatar lip-sync...");
          speak(data.message.feedback, true);
          onSpeakChange(true, "male");
          setTimeout(() => {
            console.log("Stopping male avatar lip-sync...");
            onSpeakChange(false, "male");
          }, Math.max(data.message.feedback.length * 100, 0));
        }
      });

      // Update currentPayload with flags and conversation list
      setCurrentPayload((prevPayload) => ({
        ...prevPayload,
        ...updatedFlags,
        response: data.message?.response || "",
        conversation_history_list: [
          ...prevPayload.conversation_history_list,
          input,
        ],
      }));

      // Update feedback
      if (data.message?.feedback) {
        setFeedback(data.message.feedback);
        onFeedbackChange(data.message.feedback);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, there was an error.", sender: "bot" },
      ]);
    } finally {
      setAnswerLoad(false);
      setInput("");
    }
  };

  useEffect(() => {
    // setMessages([{ text: "Hello! How can I help you?", sender: "bot" }]);
    setIsInputDisabled(false);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "600px",
          height: "290px",
          overflowY: "hidden",
          marginBottom: "20px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                background: msg.sender === "user" ? "#d1e7dd" : "#f8d7da",
                color: "#333",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          maxWidth: "600px",
        }}
      >
        <button
          onClick={handleStart}
          style={{
            padding: "10px 20px",
            background: "rgb(37, 99, 235)",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start Chat
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isInputDisabled}
          placeholder="Type your message..."
          style={{
            flex: "1",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
