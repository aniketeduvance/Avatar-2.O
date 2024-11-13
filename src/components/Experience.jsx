import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Avatar } from "./Avatar.jsx"; // Note the curly braces

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Avatar position={[0, -3, 5]} scale={2} />
      <Environment preset="sunset" />
    </>
  );
};
