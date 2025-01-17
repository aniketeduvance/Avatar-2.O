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
import { Experience } from "./components/Experience";
import { FemaleExp } from "./components/FemaleExp";
import Chatbot from "./components/Chatbot";
import WebcamComponet from "./components/WebcamComponent";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";
import { Typography } from "@mui/material";
import AvatarInfoPages from "./components/AvatarInfoPages";

function App() {
  return <AvatarInfoPages />;
}

export default App;
