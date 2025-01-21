import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import React, { useRef } from "react";

// Define the sequence of mouth shapes (visemes) used for lip-sync
const mouthShapes = [
  "viseme_PP",
  "viseme_kk",
  "viseme_I",
  "viseme_AA",
  "viseme_O",
  "viseme_U",
  "viseme_FF",
  "viseme_TH",
];
const speed = 10; // Speed of mouth shape transition

export function AvatarDemo({ isAudioPlaying }) {
  const currentShapeRef = useRef(0); // Tracks current mouth shape index
  const frameCount = useRef(0); // Controls the frame rate for shape transitions

  const { nodes, materials } = useGLTF("/models/eduvancemale.glb");

  // Function to reset all mouth shapes to default (neutral position)
  const resetMouthShapes = () => {
    mouthShapes.forEach((shape) => {
      const headInfluenceIndex = nodes.Wolf3D_Head.morphTargetDictionary[shape];
      const teethInfluenceIndex =
        nodes.Wolf3D_Teeth.morphTargetDictionary[shape];
      if (headInfluenceIndex !== undefined) {
        nodes.Wolf3D_Head.morphTargetInfluences[headInfluenceIndex] = 0;
      }
      if (teethInfluenceIndex !== undefined) {
        nodes.Wolf3D_Teeth.morphTargetInfluences[teethInfluenceIndex] = 0;
      }
    });
  };

  // Use the frame loop to animate lip movement based on `isAudioPlaying`
  useFrame(() => {
    if (!isAudioPlaying) {
      // Reset the mouth shapes if no audio is playing
      resetMouthShapes();
      return;
    }

    // Increment frame counter to control animation speed
    frameCount.current += 1;

    // Update mouth shape every `speed` frames to simulate speaking
    if (frameCount.current >= speed) {
      currentShapeRef.current =
        (currentShapeRef.current + 1) % mouthShapes.length;
      frameCount.current = 0;
    }

    // Reset all shapes to neutral, then apply the current shape for lip-sync
    resetMouthShapes();
    const shape = mouthShapes[currentShapeRef.current];

    // Apply influence to the current shape for both head and teeth
    const headInfluenceIndex = nodes.Wolf3D_Head.morphTargetDictionary[shape];
    const teethInfluenceIndex = nodes.Wolf3D_Teeth.morphTargetDictionary[shape];
    if (headInfluenceIndex !== undefined) {
      nodes.Wolf3D_Head.morphTargetInfluences[headInfluenceIndex] = 1;
    }
    if (teethInfluenceIndex !== undefined) {
      nodes.Wolf3D_Teeth.morphTargetInfluences[teethInfluenceIndex] = 1;
    }
  });

  return (
    <group dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/eduvancemale.glb");
