import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { LinearProgress } from "@mui/material";
import React, { useEffect, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStopCircle } from "@fortawesome/free-solid-svg-icons";
import { Modal, Box, Divider, Card, CardContent } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Avatar, MobileStepper, Paper, useTheme } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import SwipeableViews from "react-swipeable-views";
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  AttachmentButton,
  SendButton,
  InputToolbox,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
export default function CrucialChatbot() {
  const [csvFile, setCsvFile] = useState(null);
  const [csvload, setcsvload] = useState(false);
  const [trainload, setTrainload] = useState(false);
  const [answerload, setAnswerload] = useState(false);
  const [displayText, setDisplayText] = useState("");
  // const [question, setQuestion] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [feedbackResponses, setFeedbackResponses] = useState([]);
  const [deleteError, setdeleteError] = useState("");
  // const [selectedModel, setSelectedModel] = useState("meta.llama2-13b-chat-v1");
  // const [modeltext, setModelText] = useState("LLAMA 13b");
  const [userName, setUsername] = useState("");
  const timetaken = useRef(0);
  const [hasRunActivity, setHasRunActivity] = useState(false);
  const [chatbotFeedback, setChatbotFeedback] = useState([]);

  async function signOut() {
    try {
      await Auth.signOut({ global: true });
      window.location.reload();
    } catch (error) {
      // console.log('error signing out: ', error);
    }
  }
  const [messages, setMessages] = useState([]);
  const [genaiaccess, setgenaiaccess] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [transcript, setTranScript] = useState("");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const messagesEndRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isStartChatStarted, setIsStartChatStarted] = useState(false);
  const [empathyScore, setEmpathyScore] = useState(0);
  const [activeObservationScore, setActiveObservationScore] = useState(0);
  const [highStakesScore, setHighStakesScore] = useState(0);
  const [varyingOpinionsScore, setVaryingOpinionsScore] = useState(0);
  const [isRenderingComplete, setIsRenderingComplete] = useState(false);
  const [openPopup, setOpenPopup] = useState(true);
  const handleClosePopup = () => setOpenPopup(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [openLastPopup, setOpenLastPopup] = useState(false);
  const handleCloseLastPopup = () => setOpenLastPopup(false);
  const [handleInfoClick, setHandleInfoClick] = useState(false);
  const [resultPopupOpen, setResultPopupOpen] = useState(false);

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  // calculate progress
  const calculateProgress = (flags, currentProgress) => {
    let progress = currentProgress;

    if (flags.activity_3_1st_condition && progress < 33.3333333333)
      progress += 33.3333333333;
    if (flags.activity_4_1st_condition && progress < 66.6666666666)
      progress += 33.3333333333;
    if (flags.satisfaction_condition && progress < 100)
      progress += 33.3333333333;
    // if (flags.activity_4_2nd_condition && progress < 80) progress += 20;

    return progress;
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
    setHandleInfoClick(true);
  };

  const handleResultPopup = () => {
    setResultPopupOpen(true);
    setOpenLastPopup(true);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]; // Get the last message

      const messageList = messagesEndRef.current?.parentNode;
      if (messageList) {
        if (lastMessage.direction === "incoming") {
          // Apply the 3-second delay for incoming messages
          setTimeout(() => {
            messageList.scrollTop = messageList.scrollHeight;
          }, 3000);
        } else {
          // No delay for outgoing messages
          messageList.scrollTop = messageList.scrollHeight;
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    if (transcript.length > 0) {
      // console.log("Original Transcript: ", transcript);
      const formattedTranscript = formatResponse(transcript);
      // console.log("Formatted Response: ", formattedTranscript);
      let index = 0;
      const intervalId = setInterval(() => {
        setDisplayText((prev) => prev + formattedTranscript[index]);
        index++;
        if (index === formattedTranscript.length) {
          clearInterval(intervalId);
          setTranScript("");
          if (isRenderingComplete) {
            setIsFinished(true);
          }
        }
      }, 1);
    }
  }, [transcript]);

  useEffect(() => {
    if (
      openLastPopup === true &&
      displayText.length === formatResponse(transcript).length
    ) {
      console.log(displayText.length, formatResponse(transcript).length);
      setIsRenderingComplete(true);
    }
  }, [openLastPopup, displayText, transcript]);

  const formatResponse = (response) => {
    // Replacing markdown-like headers with HTML headers
    const headers = response
      .replace(/(######\s?)(.*?)\n/g, "<h6>$2</h6>")
      .replace(/(#####\s?)(.*?)\n/g, "<h5>$2</h5>")
      .replace(/(####\s?)(.*?)\n/g, "<h4>$2</h4>")
      .replace(/(###\s?)(.*?)\n/g, "<h3>$2</h3>")
      .replace(/(##\s?)(.*?)\n/g, "<h2>$2</h2>")
      .replace(/(#\s?)(.*?)\n/g, "<h1>$2</h1>");

    // Splitting and replacing bold markers
    let responseArray = headers.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i % 2 === 0) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }

    // Replace asterisks and newlines for proper HTML formatting
    newResponse = newResponse.replace(/\*/g, "<br/>");
    newResponse = newResponse.replace(/\n/g, "<br/>");
    newResponse = newResponse.replace(/\\"/g, '"');

    return newResponse;
  };

  useEffect(() => {
    var username = localStorage.getItem(
      "CognitoIdentityServiceProvider.29j70cln6jt05tfejrnii8d5d.LastAuthUser"
    );
    var userdata = localStorage.getItem(
      `CognitoIdentityServiceProvider.29j70cln6jt05tfejrnii8d5d.${username}.userData`
    );
    var jsondata = JSON.parse(userdata);
    let email =
      jsondata["UserAttributes"][jsondata["UserAttributes"].length - 1][
        "Value"
      ];
    email.includes("genai2244") ? setgenaiaccess(true) : setgenaiaccess(false);

    if (userdata) {
      setUsername(username);
    }
  }, []);

  const handleSendMessage = (messageText, inputId) => {
    if (messageText.trim() === "") {
      return;
    }
    // if (currentPayload.activity_4_condition === true) {
    //   messageText = `Manager: ${messageText}`;
    // }
    // Create a new message object
    const newMessage = {
      id: Math.random().toString(),
      text: messageText,
      sender: "User",
      direction: "outgoing",
    };
    // Update the messages state by adding the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    handleQuestion1(messageText);
  };

  const handleStart = async () => {
    setIsStartChatStarted(true);
    console.log("Handle Start is calling");

    // Reset any previous conversation and disable input field during loading
    setMessages([]);
    setIsInputDisabled(true);
    setAnswerload(true);
    setTranScript("");
    setDisplayText("");
    setFeedbackResponses([]);
    setProgress(0);

    const username = localStorage.getItem(
      "CognitoIdentityServiceProvider.29j70cln6jt05tfejrnii8d5d.LastAuthUser"
    );

    // Reset the current payload for a fresh start
    const resetPayload = {
      conversation_list: [], // Clear conversation history
      activity_status: false,
      users_response: "",
      welcome_message_event: false,
      start_activity: true,
      activity_1_condition: true,
      activity_2_condition: false,
      activity_3_condition: false,
      activity_4_condition: false,
      response: "",
      feedback: "",
      question_activity: false,
      response_activity: false,
      well_response: false,
      could_do_better_response: false,
      activity_2_responses_list: [],
      activity_3_1st_condition: false,
      index_of_question_answer: 0,
      activity_3_3rd_condition: false,
      activity_3_2nd_condition: false,
      conversation_history_list: [],
      activity_4_1st_condition: false,
      activity_4_2nd_condition: false,
      activity_4_condition: false,
      count: 0,
      evaluation_list: [],
      first_response: false,
      question_1_count: 0,
      satisfaction_condition: false,
      score_dict: {
        correct_answer: 0,
        no_of_question: 0,
      },
    };

    setCurrentPayload(resetPayload);
    // setCurrentPayload(initialPayload);
    console.log("Initial Payload before sending:", resetPayload);

    try {
      // Send a POST request to the backend with the initial payload
      const response = await fetch(
        "https://h6de6x6e4ova4ubumwtz3cyybm0higet.lambda-url.ap-south-1.on.aws/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resetPayload), // Send the reset payload
        }
      );

      const data = await response.json();
      console.log("First Response data:", data);

      const chatbotMessage = Array.isArray(data.message.response)
        ? data.message.response // Use the array directly if it's already an array
        : [data.message.response]; // Wrap the response in an array if it's not

      if (chatbotMessage) {
        speak(chatbotMessage);
      }

      for (let i = 0; i < chatbotMessage.length; i++) {
        const msg = chatbotMessage[i].trim();

        await new Promise((resolve) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: i === 0 ? `Hello ${username}, ${msg}` : msg,
              direction: "incoming",
              id: Math.random().toString(),
              // Render character by character and resolve when done
              onComplete: resolve, // Resolve when the message has been fully rendered
            },
          ]);
        });
      }

      // setMessages((prevMessages) => [...prevMessages, ...newMessage]);

      // Update the messages with the backend response (e.g., welcome message)
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   {
      //     text: `Welcome ${userName}, ` + data.message.response,
      //     direction: "incoming",
      //   },
      // ]);

      // const combinedMessage = chatbotMessage.join(" "); // Combine messages into a single string

      // Save the combined message for the speak function
      // setChatbotMessages(combinedMessage);

      setCurrentPayload((prevPayload) => ({
        ...prevPayload,
        ...data.message,
      }));

      setAnswerload(false);
      setIsInputDisabled(false);
    } catch (error) {
      console.error("Error fetching initial message:", error);

      // Stop loading and allow retry
      setAnswerload(false);
      setIsInputDisabled(false);
    }
  };

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

  const speak = (message) => {
    const synth = window.speechSynthesis;

    // Filter out emojis using a regular expression
    const cleanedMessage = String(message).replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    );

    if (isSpeaking) {
      // If currently speaking, stop the speech
      synth.cancel();
      setIsSpeaking(false);
    } else {
      // Otherwise, start speaking the cleaned message
      const utterance = new SpeechSynthesisUtterance(cleanedMessage);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.pitch = 1.0;
      utterance.rate = 1.0;

      synth.speak(utterance);
      setIsSpeaking(true);

      // Set isSpeaking to false when speaking stops
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const handleSpeakFeedback = () => {
    if (chatbotFeedback) {
      const cleanedFeedback = chatbotFeedback.replace(
        /[\u{1F600}-\u{1FAFF}\u{2600}-\u{27BF}:;,.!?*]/gu,
        ""
      );
      speak(cleanedFeedback);
    }
  };

  const [currentPayload, setCurrentPayload] = useState({
    conversation_list: [],
    users_response: "",
    activity_status: false,
    welcome_message_event: false,
    start_activity: true,
    activity_1_condition: true,
    activity_2_condition: false,
    activity_3_condition: false,
    activity_4_condition: false,
    response: "",
    feedback: "",
    question_activity: false,
    response_activity: false,
    well_response: false,
    could_do_better_response: false,
    activity_2_responses_list: [],
    activity_3_1st_condition: false,
    index_of_question_answer: 0,
    activity_3_3rd_condition: false,
    activity_3_2nd_condition: false,
    conversation_history_list: [],
    activity_4_1st_condition: false,
    activity_4_2nd_condition: false,
    activity_4_condition: false,
    count: 0,
    evaluation_list: [],
    first_response: false,
    question_1_count: 0,
    satisfaction_condition: false,
    score_dict: {
      correct_answer: 0,
      no_of_question: 0,
    },
  });

  const handleQuestion1 = async (question) => {
    setTranScript("");
    setDisplayText("");

    if (question.length > 0) {
      timetaken.current = 0;

      // Start timer to track time taken for the request
      let time = setInterval(() => {
        timetaken.current = parseFloat(timetaken.current) + 0.1;
      }, 100);

      setAnswerload(true);
      console.log("requesting");

      // Update the current payload with the new question and conversation list
      const updatedPayload = {
        ...currentPayload, // Get the latest state
        conversation_list: [...currentPayload.conversation_list, question], // Add the question to conversation list
        users_response: question,
      };

      console.log("Payload being sent in the second request:", updatedPayload);

      try {
        // Send the updated payload to the backend
        const response = await fetch(
          "https://h6de6x6e4ova4ubumwtz3cyybm0higet.lambda-url.ap-south-1.on.aws/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPayload), // Send the updated payload
          }
        );

        const data = await response.json();
        console.log("Second Response Data:", data);

        setAnswerload(false);

        // Extract response message and feedback
        // const chatbotMessage = data.message.response || "No message available";
        const chatbotMessage = Array.isArray(data.message.response)
          ? data.message.response // If it's an array, use it as is
          : [data.message.response];
        const chatbotConclusion = data.message.feedback || "";
        // console.log(chatbotConclusion, "111");
        setChatbotFeedback(chatbotConclusion);
        if (chatbotMessage) {
          speak(chatbotMessage);
        }

        const regex = /Score:\s*(\d)/g;
        const scores = [...chatbotConclusion.matchAll(regex)].map((match) =>
          parseInt(match[1])
        );

        setEmpathyScore(scores[0] || 0);
        setActiveObservationScore(scores[1] || 0);
        setHighStakesScore(scores[2] || 0);
        setVaryingOpinionsScore(scores[3] || 0);

        console.log("Extracted Scores: ", {
          empathyScore,
          activeObservationScore,
          highStakesScore,
          varyingOpinionsScore,
        });

        // Only update the flags or fields returned by the backend
        const updatedFlags = {
          // Update only if the backend provides the value, otherwise keep the current value
          welcome_message_event:
            data.message.welcome_message_event !== undefined
              ? data.message.welcome_message_event
              : currentPayload.welcome_message_event,
          activity_status:
            data.message.activity_status !== undefined
              ? data.message.activity_status
              : currentPayload.activity_status,
          start_activity:
            data.message.start_activity !== undefined
              ? data.message.start_activity
              : currentPayload.start_activity,
          activity_1_condition:
            data.message.activity_1_condition !== undefined
              ? data.message.activity_1_condition
              : currentPayload.activity_1_condition,
          activity_2_condition:
            data.message.activity_2_condition !== undefined
              ? data.message.activity_2_condition
              : currentPayload.activity_2_condition,
          activity_3_condition:
            data.message.activity_3_condition !== undefined
              ? data.message.activity_3_condition
              : currentPayload.activity_3_condition,
          question_activity:
            data.message.question_activity !== undefined
              ? data.message.question_activity
              : currentPayload.question_activity,
          response_activity:
            data.message.response_activity !== undefined
              ? data.message.response_activity
              : currentPayload.response_activity,
          well_response:
            data.message.well_response !== undefined
              ? data.message.well_response
              : currentPayload.well_response,
          could_do_better_response:
            data.message.could_do_better_response !== undefined
              ? data.message.could_do_better_response
              : currentPayload.could_do_better_response,
          activity_2_responses_list:
            data.message.activity_2_responses_list ||
            currentPayload.activity_2_responses_list,
          activity_3_1st_condition:
            data.message.activity_3_1st_condition !== undefined
              ? data.message.activity_3_1st_condition
              : currentPayload.activity_3_1st_condition,
          activity_3_2nd_condition:
            data.message.activity_3_2nd_condition !== undefined
              ? data.message.activity_3_2nd_condition
              : currentPayload.activity_3_2nd_condition,
          index_of_question_answer:
            data.message.index_of_question_answer !== undefined
              ? data.message.index_of_question_answer
              : currentPayload.index_of_question_answer,
          activity_3_3rd_condition:
            data.message.activity_3_3rd_condition !== undefined
              ? data.message.activity_3_3rd_condition
              : currentPayload.activity_3_3rd_condition,
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
          activity_4_condition:
            data.message.activity_4_condition !== undefined
              ? data.message.activity_4_condition
              : currentPayload.activity_4_condition,
          count:
            data.message.count !== undefined
              ? data.message.count
              : currentPayload.count,
          evaluation_list:
            data.message.evaluation_list || currentPayload.evaluation_list,
          first_response:
            data.message.first_response !== undefined
              ? data.message.first_response
              : currentPayload.first_response,
          question_1_count:
            data.message.question_1_count !== undefined
              ? data.message.question_1_count
              : currentPayload.question_1_count,
          satisfaction_condition:
            data.message.satisfaction_condition !== undefined
              ? data.message.satisfaction_condition
              : currentPayload.satisfaction_condition,
          score_dict: {
            correct_answer:
              data.message.score_dict !== undefined &&
              data.message.score_dict.correct_answer !== undefined
                ? data.message.score_dict.correct_answer
                : currentPayload.score_dict.correct_answer,
            no_of_question:
              data.message.score_dict !== undefined &&
              data.message.score_dict.no_of_question !== undefined
                ? data.message.score_dict.no_of_question
                : currentPayload.score_dict.no_of_question,
          },
        };

        // const newProgress = calculateProgress(updatedFlags);
        // setProgress(newProgress);

        // Merge backend flags and response into the current payload
        // setCurrentPayload((prevPayload) => ({
        //   ...prevPayload,
        //   ...updatedFlags, // Merge flags from backend response
        //   conversation_list: [...prevPayload.conversation_list, chatbotMessage], // Add chatbot message
        // }));

        // const combinedMessage = chatbotMessage.join(" "); // Combine messages into a single string

        // Save the combined message for the speak function
        // setChatbotMessages(combinedMessage);

        // Calculate progress directly after updating flags.
        setCurrentPayload((prevPayload) => {
          const mergedPayload = {
            ...prevPayload,
            ...updatedFlags, // Merge flags from backend response
            conversation_list: [
              ...prevPayload.conversation_list,
              ...chatbotMessage,
            ], // Add chatbot message
          };

          // Calculate progress after merging
          const newProgress = calculateProgress(mergedPayload, progress);
          setProgress(newProgress);
          console.log("Updated Progress: ", newProgress);
          return mergedPayload;
        });

        console.log(data.message.satisfaction_condition, "##########");

        if (data.message.satisfaction_condition) {
          setOpenLastPopup(true);
        }

        // Add chatbot message to the UI
        // const newMessage = {
        //   id: Math.random().toString(),
        //   text: chatbotMessage,
        //   sender: "Chatbot",
        //   direction: "incoming",
        //   feedback: chatbotConclusion,
        // };

        // const newMessage = chatbotMessage.map((msg) => ({
        //   id: Math.random().toString(),
        //   text: msg.trim(), // Ensure message is clean and not concatenated
        //   sender: "Chatbot",
        //   direction: "incoming",
        // }));

        for (let i = 0; i < chatbotMessage.length; i++) {
          const msg = String(chatbotMessage[i] || "").trim();

          await new Promise((resolve) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: msg,
                direction: "incoming",
                id: Math.random().toString(),
                feedback: chatbotConclusion,
                onComplete: resolve, // Resolve when the message has been fully rendered
              },
            ]);
          });
        }

        // **Add Demarkation Message after certain conditions are met**
        if (data.message.activity_3_1st_condition) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "------------ Activity 1 Completed ------------",
              direction: "demarkation",
              id: Math.random().toString(),
            },
          ]);
        }

        if (data.message.activity_4_1st_condition && !hasRunActivity) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "------------ Activity 2 Completed ------------",
              direction: "demarkation",
              id: Math.random().toString(),
            },
          ]);
          setHasRunActivity(true);
        }

        if (data.message.satisfaction_condition) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "------------ Activity 3 Completed ------------",
              direction: "demarkation",
              id: Math.random().toString(),
            },
          ]);
        }

        // console.log(newMessage, "new message");

        clearInterval(time);
        // setMessages((prevMessages) => [...prevMessages, ...newMessage]);
        setTranScript(chatbotConclusion);

        // Add feedback conclusion to the feedback list
        if (chatbotConclusion.trim()) {
          setFeedbackResponses((prevFeedback) => [
            ...prevFeedback,
            {
              text: `Feedback ${prevFeedback.length + 1}`,
              conclusion: chatbotConclusion,
              id: Math.random().toString(),
            },
          ]);
        }
      } catch (error) {
        console.error("Error occurred during the request:", error);
        setAnswerload(false);

        // Show an error message in the chat
        const errorMessage = {
          id: Math.random().toString(),
          text: "Something went wrong",
          sender: "Chatbot",
          direction: "incoming",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        clearInterval(time);
      }
    } else {
      setError("Please enter a question");
    }
  };

  const handleFeedbackClick = (response) => {
    setDisplayText(formatResponse(response.conclusion)); // Show the full conclusion in the feedback window
  };

  useEffect(() => {
    if (isFinished) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isFinished]);

  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const audioChunksRef = useRef([]);

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

  const handleMicrophoneStop = () => {
    if (!isRecording) return;

    if (processorRef.current) {
      processorRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);
    console.log("Recording stopped");

    if (audioChunksRef.current.length === 0) {
      console.error("No audio data captured");
      return;
    }

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

    console.log("Total audio length (samples):", fullAudioBuffer.length);

    audioChunksRef.current = [];

    // Send the audio buffer for transcription
    sendAudioToServer(fullAudioBuffer).then((transcriptionText) => {
      if (transcriptionText.startsWith("Error")) {
        console.error(transcriptionText);
      } else {
        // Call handleSendMessage with the transcription
        handleSendMessage(transcriptionText);
      }
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

  const handleButtonClick = () => {
    if (isRecording) {
      handleMicrophoneStop();
    } else {
      captureAudio();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ fontWeight: "bold", color: "#333333" }}>Hi</h2>
        <Button
          style={{
            backgroundColor: "#ffa502",
          }}
          variant="contained"
          onClick={() => {
            signOut();
          }}
          color="primary"
          component="span"
        >
          Sign Out
        </Button>
      </div>

      {/* Main Content Section */}
      {genaiaccess ? (
        <div
          style={{
            display: "flex",
            height: "85vh",
            // gap: "1rem",
            // padding: "1rem",
          }}
        >
          {/* Chat Window (7 parts) */}
          <div
            style={{
              flex: 7,
              backgroundColor: "#F7F8FA",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.4rem",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <h4 style={{ margin: 0 }}>
                {/* <strong>Crucial Conversation Business Simulation</strong> */}
                <strong>Training & Business Simulation</strong>
              </h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={handleOpenPopup}
                  style={{
                    outline: "none",
                    color: "rgb(63,81,181)",
                    backgroundColor: "transparent",
                    marginRight: "-4px", // Adjust as necessary
                    padding: 0,
                  }}
                >
                  <img src="./assets/images/info.png" width="40px" />
                </Button>

                <Button
                  onClick={handleResultPopup}
                  style={{
                    outline: "none",
                    color: "rgb(63,81,181)",
                    backgroundColor: "transparent",
                    marginLeft: "-4px", // Adjust as necessary
                    padding: 0,
                  }}
                >
                  <img src="./assets/images/result1.png" width="40px" />
                </Button>
              </div>

              {/* <Button
                variant="contained"
                color="primary"
                onClick={handleSpeakClick}
                style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
              >
                {isSpeaking ? "Stop Speaking" : "Speak Message"}
                {isStartChatStarted ? "Restart Chat" : "Start Chat"}
              </Button> */}
            </div>

            <div style={{ position: "relative", width: "100%" }}>
              {/* Linear Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={progress}
                style={{
                  borderRadius: "4px",
                  height: "8px",
                  marginBottom: "0.5rem",
                }}
              />

              {/* Text Labels on the Progress Bar */}
              <div
                style={{
                  position: "absolute",
                  top: "0px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "-20px",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                <span>Behaviour Analysis</span>
                <span>Situational Analysis</span>
                <span>Business Conversation</span>
                <span></span>
              </div>
            </div>
            <MainContainer
              style={{
                borderRadius: "1rem",
                backgroundColor: "#FFFFFF",
                boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* {showVideo ? (
                <video
                  width="350"
                  loop
                  autoPlay
                  muted
                  playsInline
                  controlsList="nodownload noplaybackrate nofullscreen"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>Video is not currently playing.</p>
              )} */}
              <ChatContainer
                style={{
                  padding: "1rem",
                  backgroundColor: "#FFFFFF",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  overflow: "hidden",
                }}
              >
                <MessageList
                  style={{
                    color: "#333333",
                    backgroundColor: "#FFFFFF",
                    flexGrow: 1,
                    overflowY: "auto",
                    marginBottom: "1rem",
                    paddingRight: "1rem",
                    maxHeight: "calc(100% - 60px)",
                  }}
                  typingIndicator={
                    answerload && (
                      <TypingIndicator content="Associate is typing..." />
                    )
                  }
                  autoScrollToBottomOnMount={true}
                >
                  {Array.isArray(messages) &&
                    messages.map((message, index) => (
                      <div
                        key={index}
                        style={{
                          display:
                            message.direction === "demarkation"
                              ? "block"
                              : "flex",
                          alignItems: "flex-end",
                          marginBottom: "1rem",
                          justifyContent:
                            message.direction === "outgoing"
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        {/* Incoming message */}
                        {message.direction === "incoming" && (
                          <>
                            <img
                              src="/assets/images/chatbot1.png"
                              alt="Chatbot Icon"
                              style={{
                                marginRight: "0.5rem",
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                              }}
                            />
                            <div
                              style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: "1rem",
                                backgroundColor: "#E0E0E0",
                                padding: "0.75rem 1.5rem",
                                borderRadius: "20px 20px 20px 0",
                                maxWidth: "91%",
                                wordWrap: "break-word",
                              }}
                            >
                              <CharacterByCharacter
                                message={message.text}
                                messagesEndRef={messagesEndRef}
                                onComplete={message.onComplete}
                              />
                            </div>
                          </>
                        )}
                        {/* Outgoing message */}
                        {message.direction === "outgoing" && (
                          <>
                            <div
                              style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: "1rem",
                                backgroundColor: "#9FC8E4",
                                padding: "0.75rem",
                                borderRadius: "20px 20px 0 20px",
                                maxWidth: "70%",
                                wordWrap: "break-word",
                                color: "#333333",
                                marginRight: "0.5rem",
                              }}
                            >
                              {message.text}
                            </div>
                            <img
                              src="/assets/images/man_icon.png"
                              alt="User Icon"
                              style={{
                                marginLeft: "0.5rem",
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                              }}
                            />
                          </>
                        )}
                        {message.direction === "demarkation" && (
                          <div
                            style={{
                              textAlign: "center",
                              color: "#555555",
                              fontSize: "0.9rem",
                              fontFamily: "'Outfit', sans-serif",
                              margin: "1rem 0",
                            }}
                          >
                            {message.text}
                          </div>
                        )}
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </MessageList>

                {/* Input Toolbox */}
                <InputToolbox
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStart}
                    style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
                  >
                    {isStartChatStarted ? "Restart Chat" : "Start Chat"}
                  </Button>
                  <MessageInput
                    attachButton={false}
                    placeholder="Type your response here..."
                    onSend={(messageText) => {
                      let sanitizedMessage = messageText.replace(
                        /&nbsp;/g,
                        " "
                      );

                      // Preserve leading spaces with &nbsp;
                      sanitizedMessage = sanitizedMessage.replace(
                        /^\s+/,
                        (match) => {
                          return match
                            .split("")
                            .map(() => "&nbsp;")
                            .join("");
                        }
                      );

                      handleSendMessage(sanitizedMessage.trim());
                    }}
                    disabled={
                      isInputDisabled ||
                      transcript.length > 0 ||
                      currentPayload.satisfaction_condition === true ||
                      isSpeaking
                    }
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      borderRadius: "8px",
                      backgroundColor: "#F0F2F5",
                      color: "#121212",
                      padding: "0.75rem",
                      border: "1px solid #E0E0E0",
                      boxSizing: "border-box",
                      fontSize: "1rem",
                      width: "77%",
                      position: "relative",
                      zIndex: 10,
                      display: "flex", // Use flexbox
                      alignItems: "center",
                      gap: "10px",
                    }}
                  />
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
                        fontSize: "0.8rem",
                        marginTop: "4px",
                      }}
                    >
                      {isRecording ? "Stop" : "Speak"}
                    </span>
                  </button>
                </InputToolbox>
              </ChatContainer>
            </MainContainer>
          </div>

          {/* Right Side (3 parts) */}

          <div
            style={{
              flex: 3,
              fontFamily: "'Outfit', sans-serif",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h4 style={{ margin: 0 }}>
                <strong>Feedback Window</strong>
              </h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={handleSpeakFeedback}
                  style={{
                    outline: "none",
                    marginLeft: "-4px",
                    backgroundColor: "transparent",
                  }}
                >
                  <img src="/assets/images/speaker.png" width="35px" />
                </Button>
                <Button
                  onClick={generatePDF}
                  style={{
                    outline: "none",
                    marginRight: "-4px",
                    backgroundColor: "transparent",
                  }}
                >
                  <img src="/assets/images/download-img2.png" width="60px" />
                </Button>
              </div>
            </div>
            <div
              style={{
                color: "#333333",
                padding: "1rem",
                border: "1px solid #D1DBE3",
                borderRadius: "1rem",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                flex: 1,
                minHeight: "550px",
                fontSize: "1rem",
                overflowY: "auto",
              }}
            >
              {/* Feedback Buttons */}
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  flexWrap: "wrap", // Allow buttons to wrap to the next line
                  gap: "10px", // Optional: Add spacing between buttons
                }}
              >
                {feedbackResponses.map((response, index) => (
                  <Button
                    key={response.id}
                    variant="contained"
                    color="primary"
                    onClick={() => handleFeedbackClick(response)} // Display full feedback on click
                    // style={{
                    //   flex: "1 1 calc(33.33% - 10px)", // Ensure 3 buttons per row with space between
                    //   textTransform: "none",
                    //   marginBottom: "10px", // Spacing between rows
                    // }}
                    style={{
                      flex: "1 1 calc(33.33% - 10px)",
                      textTransform: "none",
                      marginBottom: "10px",
                      width: "100%",
                      minWidth: "120px",
                      maxWidth: "200px",
                      padding: "10px 20px",
                      boxSizing: "border-box",
                    }}
                  >
                    {response.text} {/* Shows Feedback 1, Feedback 2, etc. */}
                  </Button>
                ))}
              </div>
              {displayText.length > 0 ? (
                <div
                  style={{
                    color: "#333333",
                    fontFamily: "'Outfit', sans-serif",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{ __html: displayText }}
                ></div>
              ) : (
                "Training feedback will be displayed here"
              )}

              <Modal
                // open={openPopup}
                open={openLastPopup && isFinished}
                onClose={handleCloseLastPopup}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                  height: "100vh",
                  width: "100vw",
                  backdropFilter: "blur(8px)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "#002F6C",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: "16px",
                    boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
                    width: { xs: "90%", sm: "600px", md: "800px" },
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    padding: "2rem 5rem",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Heading Section */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      textAlign: "center", // Center the heading
                      mb: 2,
                      fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                  >
                    <strong
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      Congratulations {userName} for completing the Managerial
                      Feedback Training!🎉
                    </strong>
                  </Typography>

                  {/* Divider to separate sections */}
                  <Divider sx={{ mb: 2, backgroundColor: "#002F6C" }} />

                  {/* Result Section */}
                  <Box sx={{ mb: 3, margin: "0 auto" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        textAlign: "center",
                        color: "#555",
                        fontSize: { xs: "1.2rem", md: "1.5rem" },
                      }}
                    >
                      <strong>Result</strong>: <br />
                      You scored{" "}
                      <span style={{ color: "#44bd32", fontWeight: "bold" }}>
                        {currentPayload.score_dict.correct_answer}/
                        {currentPayload.score_dict.no_of_question}
                      </span>{" "}
                      in Situational Questions.
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.8,
                        color: "#555",
                        fontSize: { xs: "1rem", md: "1.1rem" },
                      }}
                    >
                      <ul
                        style={{
                          paddingLeft: "0px",
                          marginTop: "10px",
                          listStyle: "none",
                          marginBottom: "0px",
                        }}
                      >
                        <li
                          style={{
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.4rem",
                          }}
                        >
                          🫶 Empathy Score:
                          <span
                            style={{
                              marginLeft: "10px",
                              color: "#e1b12c",
                              fontSize: "1.5rem",
                            }}
                          >
                            {empathyScore}/5
                          </span>
                        </li>

                        <li
                          style={{
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.4rem",
                          }}
                        >
                          👀 Active Observation Score:
                          <span
                            style={{
                              marginLeft: "10px",
                              color: "#8c7ae6",
                              fontSize: "1.4rem",
                            }}
                          >
                            {activeObservationScore}/5
                          </span>
                        </li>

                        <li
                          style={{
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.4rem",
                          }}
                        >
                          ⚖️ Check for High Stakes Score:
                          <span
                            style={{
                              marginLeft: "10px",
                              color: "#00a8ff",
                              fontSize: "1.5=4rem",
                            }}
                          >
                            {highStakesScore}/5
                          </span>
                        </li>

                        <li
                          style={{
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.4rem",
                          }}
                        >
                          💬 Identify Varying Opinions Score:
                          <span
                            style={{
                              marginLeft: "10px",
                              color: "#c23616",
                              fontSize: "1.4rem",
                            }}
                          >
                            {varyingOpinionsScore}/5
                          </span>
                        </li>
                      </ul>
                    </Typography>
                  </Box>

                  {/* Divider to separate sections */}
                  <Divider sx={{ mb: 2, backgroundColor: "#002F6C" }} />

                  {/* Action Button */}
                  <span
                    style={{
                      paddingLeft: "24px",
                      display: "block",
                      color: "#555",
                      textAlign: "center",
                    }}
                  >
                    Click on "Retake" to start the training again, or "Close" to
                    exit this result window and proceed.
                  </span>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "24px",
                      mt: 2,
                    }}
                  >
                    <Button
                      onClick={handleCloseLastPopup}
                      variant="contained"
                      sx={{
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                        fontSize: "1.2rem",
                        borderRadius: "8px",
                        backgroundColor: "#44bd32", // Custom primary color
                        transition: "0.3s",
                        "&:hover": {
                          backgroundColor: "#4cd137", // Darker hover effect
                          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        if (handleCloseLastPopup) handleCloseLastPopup();
                        if (handleStart) handleStart();
                      }}
                      sx={{
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                        fontSize: "1.2rem",
                        borderRadius: "8px",
                        backgroundColor: "#00a8ff",
                        color: "#fff",
                        transition: "0.3s ease",
                        "&:hover": {
                          backgroundColor: "#0097e6",
                          transform: "scale(1.05)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                        },
                      }}
                      variant="contained"
                    >
                      Retake
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      ) : (
        <h2 style={{ color: "#333333", textAlign: "center" }}>
          You do not have access to use this section.
        </h2>
      )}
    </div>
  );
}

const CharacterByCharacter = ({ message, messagesEndRef, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const formattedMessage =
      typeof message === "string" ? message : String(message);

    let responseArray = formattedMessage.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i % 2 === 0) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }

    newResponse = newResponse.replace(/\*/g, "<br/>");
    newResponse = newResponse.replace(/\n/g, "<br/>");
    newResponse = newResponse.replace(/\\"/g, '"');

    let currentIndex = 0;
    // Calculate typing interval based on message length and speech rate
    // const estimatedSpeechDuration = (formattedMessage.length / 1.0) * 50; // Adjust multiplier if needed
    // const typingInterval = estimatedSpeechDuration / newResponse.length;

    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + newResponse[currentIndex]);
      currentIndex += 1;
      // Trigger scroll every time a new character is displayed
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
      if (currentIndex === newResponse.length) {
        clearInterval(intervalId);
        if (onComplete) {
          onComplete(); // Notify when rendering is complete
        }
      }
    }, 63);

    return () => clearInterval(intervalId);
  }, [message, messagesEndRef, onComplete]);

  return <span dangerouslySetInnerHTML={{ __html: displayedText }} />;
};
