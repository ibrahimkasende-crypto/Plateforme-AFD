"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { createWaterRippleMaterial } from "./water-ripple-material";
import type { WaterRippleProps } from "./types";

type SceneProps = WaterRippleProps & {
  pointerRef: MutableRefObject<{ x: number; y: number; active: boolean }>;
  strengthRef: MutableRefObject<number>;
  skyBoostRef: MutableRefObject<number>;
};

export function WaterRippleScene({
  intensity,
  radius,
  pointerRef,
  strengthRef,
  skyBoostRef,
}: SceneProps) {
  const material = useMemo(
    () => createWaterRippleMaterial(intensity, radius),
    [intensity, radius],
  );
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { size, viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    materialRef.current = material;
    material.uniforms.uResolution.value.set(size.width, size.height);
  }, [material, size.height, size.width]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    (mat.uniforms.uPointer.value as THREE.Vector2).set(
      pointerRef.current.x,
      size.height - pointerRef.current.y,
    );
    mat.uniforms.uStrength.value = strengthRef.current;
    mat.uniforms.uIntensity.value = intensity;
    mat.uniforms.uRadius.value = radius;
    mat.uniforms.uSkyBoost.value = skyBoostRef.current;
  });

  return (
    <mesh
      ref={meshRef}
      scale={[viewport.width, viewport.height, 1]}
      material={material}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
