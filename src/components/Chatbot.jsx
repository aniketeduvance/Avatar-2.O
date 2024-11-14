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
  "https://imgqtfwjnae4ewkaeztznr4wb40dzwfn.lambda-url.ap-south-1.on.aws/";

export default function Chatbot({ onSpeakChange }) {
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [input, setInput] = useState("");
  const [currentPayload, setCurrentPayload] = useState({
    response: "",
    feedback: "",
    initial_condition: true,
    second_condition: false,
    conversation_list: [],
    status: false,
    salesperson_response: "",
  });
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [answerLoad, setAnswerLoad] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const englishVoice = availableVoices.find(
        (voice) => voice.lang === "en-GB" || voice.lang === "en-US"
      );
      const fallbackVoice = availableVoices.find((voice) =>
        voice.lang.startsWith("en")
      );
      setSelectedVoice(englishVoice || fallbackVoice);
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, []);

  const speak = (message) => {
    const synth = window.speechSynthesis;
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
      if (selectedVoice) utterance.voice = selectedVoice;
      synth.speak(utterance);
      setIsSpeaking(true);
      onSpeakChange(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeakChange(false);
      };
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const updatedPayload = {
      ...currentPayload,
      conversation_list: [...currentPayload.conversation_list, input],
    };

    try {
      setAnswerLoad(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      const data = await response.json();
      const botMessage = {
        text: data.message?.response || "No response from bot",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      if (data.message.response) speak(data.message.response);
      setCurrentPayload((prevPayload) => ({
        ...prevPayload,
        response: data.message?.response || "",
        conversation_list: [
          ...prevPayload.conversation_list,
          input,
          data.message?.response,
        ],
      }));
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
    setMessages([{ text: "Hello! How can I help you?", sender: "bot" }]);
    setIsInputDisabled(false);
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <MainContainer style={{ width: "100%", height: "100%" }}>
        <ChatContainer>
          <MessageList
            style={{
              width: "500px",
            }}
          >
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={{
                  message: msg.text,
                  sentTime: "just now",
                  sender: msg.sender === "user" ? "You" : "Bot",
                  direction: msg.sender === "user" ? "outgoing" : "incoming",
                }}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  borderRadius: "15px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              />
            ))}
            <div ref={messagesEndRef} />
          </MessageList>
          <MessageInput
            placeholder="Type your message..."
            value={input}
            onChange={(val) => setInput(val)}
            onSend={sendMessage}
            disabled={isInputDisabled}
          />
        </ChatContainer>
      </MainContainer>
    </Box>
  );
}
