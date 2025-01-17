import { useState } from "react";
import SliderComponent from "../components/SliderCompoent";
import Chatbot from "./Chatbot";
import MainAvatar from "../components/MainAvatar";

const AvatarInfoPages = () => {
  const [currentView, setCurrentView] = useState("home");
  return (
    <div
      className="w-screen h-screen flex flex-col"
      style={{
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {currentView === "home" && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            backgroundImage: "url('../../public/images/home-banner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "calc(100% - 8rem)",
              height: "calc(100% - 8rem)",
              transform: "translate(-50%, -50%)",
              border: "5px solid rgba(255, 255, 255, 0.8)",
              borderRadius: "16px",
              overflow: "hidden",
              boxSizing: "border-box",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "white",
                lineHeight: "1.5",
              }}
            >
              Welcome to
              <br />
              <span
                style={{
                  color: "yellow",
                  fontWeight: "bold",
                  fontSize: "1.5em",
                }}
              >
                Simulation on Crucial Conversation
              </span>
              <br />
              This simulation will assist you in practicing your approach on
              giving feedback.
            </h2>
            <button
              onClick={() => setCurrentView("slider")}
              style={{
                fontSize: "1.15rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "7rem",
                padding: "0.8rem 2rem",
                backgroundColor: "#FF5A5F",
                color: "white",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                lineHeight: "1",
              }}
            >
              Click here to begin
            </button>
          </div>
        </div>
      )}

      {currentView === "slider" && (
        <SliderComponent setCurrentView={setCurrentView} />
      )}

      {currentView === "newComponent" && <MainAvatar />}
    </div>
  );
};

export default AvatarInfoPages;
