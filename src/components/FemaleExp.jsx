import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { AvatarDemo } from "./AvatarDemo";
import { FemaleAvatar } from "./FemaleAvatar";

export const FemaleExp = ({ isAudioPlaying }) => {
  return (
    <>
      <OrbitControls />
      <group position-y={-1.58}>
        {/* <AvatarDemo isAudioPlaying={isAudioPlaying} /> */}
        <FemaleAvatar isAudioPlaying={isAudioPlaying} />
      </group>
      <Environment preset="sunset" />
    </>
  );
};
