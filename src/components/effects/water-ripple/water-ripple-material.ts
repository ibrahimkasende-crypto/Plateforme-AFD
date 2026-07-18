import * as THREE from "three";
import {
  waterRippleFragmentShader,
  waterRippleVertexShader,
} from "./water-ripple-shaders";

export function createWaterRippleMaterial(
  intensity: number,
  radius: number,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 as number },
      uPointer: { value: new THREE.Vector2(-9999, -9999) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uIntensity: { value: intensity },
      uRadius: { value: radius },
      uStrength: { value: 0 as number },
    },
    vertexShader: waterRippleVertexShader,
    fragmentShader: waterRippleFragmentShader,
  });
}
