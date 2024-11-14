import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { AvatarDemo } from "./AvatarDemo";

export const Experience = ({ isAudioPlaying }) => {
  return (
    <>
      <OrbitControls />
      <group position-y={-1.5}>
        <AvatarDemo isAudioPlaying={isAudioPlaying} />
      </group>
      <Environment preset="sunset" />
    </>
  );
};
