// Avatar.jsx
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import React, { useState, useRef } from "react";

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
const speed = 10; // Adjust this value to control the speed of lip movement

export function Avatar({ isAudioPlaying }) {
  const [currentShape, setCurrentShape] = useState(0); // Track the current mouth shape
  const frameCount = useRef(0); // Counter to control animation speed
  const { nodes, materials } = useGLTF("/models/673195710a5a634d6093651b.glb");

  // Function to reset all mouth shapes to default
  const resetMouthShapes = () => {
    mouthShapes.forEach((shape) => {
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary[shape]
      ] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[
        nodes.Wolf3D_Teeth.morphTargetDictionary[shape]
      ] = 0;
    });
  };

  useFrame(() => {
    if (!isAudioPlaying) {
      resetMouthShapes();
      return; // Only animate lips when audio is playing
    }

    frameCount.current += 1;

    // Only update the mouth shape when frameCount reaches the speed threshold
    if (frameCount.current >= speed) {
      setCurrentShape((prev) => (prev + 1) % mouthShapes.length);
      frameCount.current = 0; // Reset the counter
    }

    // Reset all morph target influences to 0
    resetMouthShapes();

    // Set the influence of the current mouth shape to 1
    const shape = mouthShapes[currentShape];
    nodes.Wolf3D_Head.morphTargetInfluences[
      nodes.Wolf3D_Head.morphTargetDictionary[shape]
    ] = 1;
    nodes.Wolf3D_Teeth.morphTargetInfluences[
      nodes.Wolf3D_Teeth.morphTargetDictionary[shape]
    ] = 1;
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

useGLTF.preload("/models/673195710a5a634d6093651b.glb");
