import React, { useState } from "react";

const SliderComponent = ({ setCurrentView }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");

  // Updated slider content array (removed the first two slides)
  const slides = [
    {
      title: "Your Objective",
      description: [
        "Based on your responses, this simulation will determine your proficiency",
        "on the following 4 tenets:",
      ],
      image: "/images/business-empathy1.jpg",
      subtitle: "Tenet 1 - Empathy:",
      subdescription:
        "Deeply understand and relate to the emotions, perspectives, and needs of others, whether employees, clients, or stakeholders. This will help foster stronger relationships, increase emotional intelligence, and build a supportive team culture.",
    },
    {
      title: "Your Objective",
      description: [
        "Based on your responses, this simulation will determine your proficiency",
        "on the following 4 tenets:",
      ],
      image: "/images/business-active.jpg",
      subtitle: "Tenet 2 - Active Observation:",
      subdescription:
        "Be fully aware of and attentive to subtle cues, behaviors, or environmental factors that provide insight into team dynamics, project progress, or potential problems. This will help spot issues early, understand team strengths and weaknesses, and adjust their approach as needed.",
    },
    {
      title: "Your Objective",
      description: [
        "Based on your responses, this simulation will determine your proficiency",
        "on the following 4 tenets:",
      ],
      image: "/images/high-stakes.jpg",
      subtitle: "Tenet 3 - Check for High Stakes:",
      subdescription:
        "To evaluate the potential consequences of decisions or situations to determine if the stakes are high, and adjust actions based on the risk involved. This ensures that resources, time, and attention are allocated proportionate to the significance of a situation.",
    },
    {
      title: "Your Objective",
      description: [
        "Based on your responses, this simulation will determine your proficiency",
        "on the following 4 tenets:",
      ],
      image: "/images/tenet4-img.jpg",
      subtitle: "Tenet 4 - Identify Varying Opinions:",
      subdescription:
        "To actively recognize and consider the diverse opinions, viewpoints, and feedback from team members or stakeholders. This will help grow inclusivity, spark creativity, and lead to better decision-making, helping managers achieve improved outcomes.",
    },
    {
      title: "Your Objective",
    },
  ];

  // Handle navigation
  const handleNext = () => {
    setSlideDirection("next");
    setCurrentSlide((prev) => (prev + 1) % slides.length); // Loop back to first slide
  };

  const handlePrevious = () => {
    setSlideDirection("prev");
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); // Loop back to last slide
  };

  const currentContent = slides[currentSlide];

  return (
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
      <style>
        {`
          @keyframes slideInNext {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideInPrev {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .slide-content {
            animation: ${
              slideDirection === "next" ? "slideInNext" : "slideInPrev"
            } 0.5s forwards;
          }
          
          .nav-button {
            transition: transform 0.2s ease;
          }
          
          .nav-button:hover {
            transform: scale(1.1);
          }
        `}
      </style>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "calc(100% - 8rem)",
          height: "calc(100% - 8rem)",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          border: "2px solid rgba(255, 255, 255, 0.8)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "row",
          padding: "3rem",
          boxSizing: "border-box",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className={
            currentSlide === slides.length - 1 ? "" : "slide-content animate"
          }
          key={currentSlide}
        >
          {currentSlide < slides.length - 1 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  position: "absolute",
                  top: "50%",
                  left: "1.25rem",
                  transform: "translateY(-50%)",
                }}
                onClick={handlePrevious}
                onFocus={(e) => e.target.blur()}
              >
                <img
                  src="../../public/images/left-arrow1.png"
                  style={{ width: "50px", height: "50px" }}
                  alt="Previous"
                />
              </button>
              <div
                style={{
                  maxWidth: "80%",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {currentContent.title}
                </h2>
                <p
                  style={{
                    fontSize: "1.5rem",
                    maxWidth: "80%",
                  }}
                >
                  {currentContent.description.join(" ")}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  backgroundColor: "white",
                  borderRadius: "50px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  width: "80%",
                  overflow: "hidden",
                  margin: "20px auto",
                  justifyContent: "space-around",
                  height: "350px",
                }}
              >
                {/* Left Side Content */}
                <div
                  style={{
                    padding: "40px 20px",
                    maxWidth: "45%",
                    flex: 1,
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      color: "#333",
                      marginBottom: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {currentContent.subtitle}
                  </h2>
                  <p
                    style={{
                      fontSize: "1.25rem",
                      lineHeight: "1.25",
                      color: "#666",
                    }}
                  >
                    {currentContent.subdescription}
                  </p>
                </div>

                {/* Right Side Image */}
                <div
                  style={{
                    flex: "0 0 300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                    padding: "40px 20px",
                  }}
                >
                  <img
                    src={currentContent.image}
                    alt={currentContent.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "300px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  position: "absolute",
                  top: "50%",
                  right: "1.5rem",
                  transform: "translateY(-50%)",
                }}
                onClick={handleNext}
                onFocus={(e) => e.target.blur()}
              >
                <img
                  src="../../public/images/right-arrow.png"
                  style={{ width: "50px", height: "50px" }}
                  alt="Next"
                />
              </button>
            </div>
          ) : (
            // Last Slide
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // Full viewport height ensures vertical centering
                margin: "0", // Removes default margin
                textAlign: "center", // Ensures text inside is centered
              }}
            >
              <p
                style={{
                  color: "white",
                  lineHeight: "1.5",
                  fontSize: "1.8rem", // Adjusted font size to match the styling
                  fontWeight: "bold", // Emphasize the heading
                  margin: "2rem auto",
                }}
              >
                I am ready!
              </p>
              <button
                onClick={() => setCurrentView("newComponent")}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "2rem", // Adjust spacing for consistency
                  padding: "0.8rem 2rem",
                  backgroundColor: "#FF5A5F",
                  color: "white",
                  fontSize: "1.15rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  lineHeight: "1",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add button shadow for consistency
                }}
              >
                Begin Simulation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;
