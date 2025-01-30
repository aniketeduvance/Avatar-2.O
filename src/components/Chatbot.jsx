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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStopCircle } from "@fortawesome/free-solid-svg-icons";

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
          // speak(data.message.response, false);
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
          // speak(data.message.feedback, true);
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

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    console.log("sendMessage called with:", messageText);
    setIsInputDisabled(true);
    setInput("");

    const userMessage = { text: messageText, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    console.log("Updated messages state:", messages);

    const updatedPayload = {
      ...currentPayload,
      conversation_history_list: [
        ...currentPayload.conversation_history_list,
        messageText,
      ],
    };

    console.log("Updated Payload before sending:", updatedPayload);

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
          // speak(data.message.response, false);
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
          // speak(data.message.feedback, true);
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
        feedback: data.message?.feedback || prevPayload.feedback,
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
      setIsInputDisabled(false);
    }
  };

  // const sendMessage = async (messageText) => {
  //   const text = messageText || input; // Ensure correct input source
  //   if (!text.trim()) return;

  //   setIsInputDisabled(true);
  //   setInput(""); // Clear input field

  //   // Add user's message to chat
  //   const userMessage = { text, sender: "user" };
  //   setMessages((prevMessages) => [...prevMessages, userMessage]);

  //   // Show only the previous bot response before fetching the new one
  //   if (previousResponse) {
  //     const botMessage = {
  //       text: previousResponse, // Display ONLY previous response, not the new one
  //       sender: "bot",
  //     };
  //     setMessages((prevMessages) => [...prevMessages, botMessage]);
  //   }

  //   // Reset previousResponse so it doesn’t duplicate in the next request
  //   setPreviousResponse("");

  //   // Update payload with new conversation history
  //   const updatedPayload = {
  //     ...currentPayload,
  //     conversation_history_list: [
  //       ...currentPayload.conversation_history_list,
  //       text, // Add new message to history
  //     ],
  //   };

  //   try {
  //     setAnswerLoad(true);

  //     // Send request to backend
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(updatedPayload),
  //     });

  //     const data = await response.json();
  //     console.log("API Response:", data);

  //     // Store the latest response for next time
  //     setPreviousResponse(data.message?.response || "");
  //     if (data.message?.response) {
  //       onResponseChange(data.message.response);
  //     }

  //     // Handle Lip-Sync for the bot's response
  //     const femaleVoiceDone = new Promise((resolve) => {
  //       if (data.message?.response) {
  //         console.log("Triggering female avatar lip-sync...");
  //         onSpeakChange(true, "female");

  //         setTimeout(() => {
  //           console.log("Stopping female avatar lip-sync...");
  //           onSpeakChange(false, "female");
  //           resolve();
  //         }, Math.max(data.message.response.length * 100, 0));
  //       } else {
  //         resolve();
  //       }
  //     });

  //     femaleVoiceDone.then(() => {
  //       if (data.message?.feedback) {
  //         console.log("Triggering male avatar lip-sync...");
  //         onSpeakChange(true, "male");

  //         setTimeout(() => {
  //           console.log("Stopping male avatar lip-sync...");
  //           onSpeakChange(false, "male");
  //         }, Math.max(data.message.feedback.length * 100, 0));
  //       }
  //     });

  //     // Display only the latest bot response
  //     if (data.message?.response) {
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { text: data.message.response, sender: "bot" },
  //       ]);
  //       // speak(data.message.response, false);
  //     }

  //     // Display and speak feedback if available
  //     if (data.message?.feedback) {
  //       setFeedback(data.message.feedback);
  //       onFeedbackChange(data.message.feedback);
  //       // speak(data.message.feedback, true);
  //     }

  //     // Update the payload with conversation history
  //     setCurrentPayload((prevPayload) => ({
  //       ...prevPayload,
  //       ...data.message,
  //       conversation_history_list: [
  //         ...prevPayload.conversation_history_list,
  //         text,
  //       ],
  //       feedback: data.message?.feedback || prevPayload.feedback,
  //     }));
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { text: "Sorry, there was an error.", sender: "bot" },
  //     ]);
  //   } finally {
  //     setAnswerLoad(false);
  //     setIsInputDisabled(false);
  //   }
  // };

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

      if (!englishVoice && !fallbackVoice) {
        console.warn("No suitable English voice found; using default voice.");
      }
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }

    // Stop speech if any other button is clicked
    const handleButtonClick = (event) => {
      if (
        event.target.tagName === "BUTTON" &&
        !event.target.classList.contains("speak-button")
      ) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };

    // Stop speech when the page is about to unload (refresh or navigate away)
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };

    // Add event listeners for button clicks and page unload
    document.addEventListener("click", handleButtonClick);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup: Remove event listeners on unmount
    return () => {
      document.removeEventListener("click", handleButtonClick);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.speechSynthesis.cancel();
    };
  }, []);

  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleMicrophoneStop = async () => {
    if (!isRecording) return;

    // Stop audio processing
    if (processorRef.current) processorRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    if (streamRef.current)
      streamRef.current.getTracks().forEach((track) => track.stop());

    setIsRecording(false);
    console.log("Recording stopped");

    if (audioChunksRef.current.length === 0) {
      console.error("No audio data captured");
      return;
    }

    // Convert audio data to buffer
    const totalLength = audioChunksRef.current.reduce(
      (acc, chunk) => acc + chunk.length,
      0
    );
    const fullAudioBuffer = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunksRef.current) {
      fullAudioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    audioChunksRef.current = []; // Clear for next recording

    // Send the audio buffer for transcription
    const transcriptionText = await sendAudioToServer(fullAudioBuffer);

    console.log("Transcription received:", transcriptionText); // ✅ Check if transcription is received

    if (transcriptionText.startsWith("Error")) {
      console.error(transcriptionText);
    } else {
      console.log(
        "Sending transcribed message to sendMessage:",
        transcriptionText
      ); // ✅ Debugging
      sendMessage(transcriptionText); // ✅ Send message to backend
    }
  };

  const captureAudio = () => {
    if (isRecording) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsRecording(true);
        const audioContext = new AudioContext({ sampleRate: 16000 });
        audioContextRef.current = audioContext;

        const input = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        streamRef.current = stream;

        input.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (event) => {
          const audioData = event.inputBuffer.getChannelData(0);
          audioChunksRef.current.push(new Float32Array(audioData));
          console.log("Audio chunk received:", audioData.length);
        };

        console.log("Recording started");
      })
      .catch((err) => {
        console.error("Error capturing audio:", err);
      });
  };

  const sendAudioToServer = async (fullAudioBuffer) => {
    try {
      const int16Buffer = convertFloat32ToInt16(fullAudioBuffer);
      console.log("Int16 Buffer Length:", int16Buffer.length);

      const base64Audio = arrayBufferToBase64(int16Buffer.buffer);
      console.log("Base64 Audio Length:", base64Audio.length);

      const data = {
        "audio-data": base64Audio,
      };

      const response = await fetch(
        "https://2ebgwsxstddkvpgcehqjrhoflu0lerly.lambda-url.ap-south-1.on.aws/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const jsonResponse = await response.json();
      console.log("Server Response:", jsonResponse);

      if (response.ok && jsonResponse.transcription) {
        return jsonResponse.transcription;
      } else {
        console.error("Error from server:", jsonResponse);
        return `Error processing transcription: ${
          jsonResponse.message || "Unknown error"
        }`;
      }
    } catch (error) {
      console.error("Error sending audio data:", error);
      return `Error sending audio data: ${error.message || "Unknown error"}`;
    }
  };

  const convertFloat32ToInt16 = (buffer) => {
    const int16Buffer = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      let s = Math.max(-1, Math.min(1, buffer[i]));
      int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Buffer;
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleSendMessage = (messageText, inputId) => {
    if (messageText.trim() === "") {
      return;
    }
    const newMessage = {
      id: Math.random().toString(),
      text: messageText,
      sender: "User",
      direction: "outgoing",
    };
    // Update the messages state by adding the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    sendMessage(messageText);
  };

  useEffect(() => {
    // setMessages([{ text: "Hello! How can I help you?", sender: "bot" }]);
    setIsInputDisabled(false);
  }, []);

  const handleButtonClick = () => {
    if (isRecording) {
      handleMicrophoneStop();
    } else {
      captureAudio();
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "600px",
          height: "290px",
          overflowY: "auto",
          marginBottom: "20px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "70%", // Limit message width for better readability
                padding: "10px",
                borderRadius: "10px",
                background: msg.sender === "user" ? "#d1e7dd" : "#f8d7da",
                color: "#333",
                textAlign: "left",
                whiteSpace: "pre-wrap", // Allow multiline messages
                wordWrap: "break-word", // Prevent overflow issues
              }}
            >
              {msg.text}
            </div>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage(input);
            }
          }}
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
          onClick={() => sendMessage(input)}
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
        <button
          onClick={handleButtonClick}
          disabled={isInputDisabled}
          style={{
            background: "transparent",
            border: "none",
            cursor: isInputDisabled ? "not-allowed" : "pointer",
            fontSize: "1rem",
            fontFamily: "'Outfit', sans-serif",
            color: "#121212",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            outline: "none",
          }}
        >
          <FontAwesomeIcon
            icon={isRecording ? faStopCircle : faMicrophone}
            // icon={faMicrophone}
            size="lg"
            color={isRecording ? "red" : "black"}
          />
          <span
            style={{
              fontSize: "0.5rem",
            }}
          >
            {isRecording ? "Stop" : "Speak"}
          </span>
        </button>
      </div>
    </div>
  );
}
