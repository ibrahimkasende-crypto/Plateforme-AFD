export const waterRippleVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Ondes radiales plus marquées + teinte bleu ciel renforcée sur surfaces claires.
 * Reste transparent ; ne colore pas toute la page.
 */
export const waterRippleFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform float uIntensity;
uniform float uRadius;
uniform float uStrength;
uniform float uSkyBoost;
varying vec2 vUv;

void main() {
  vec2 pixel = vUv * uResolution;
  vec2 center = uPointer;
  float dist = distance(pixel, center);
  float radius = max(uRadius, 48.0);

  float falloff = 1.0 - smoothstep(radius * 0.08, radius, dist);
  float softCore = 1.0 - smoothstep(0.0, radius * 0.55, dist);

  // Double onde : anneaux plus actifs + respiration douce
  float waveA = sin(dist * 0.11 - uTime * 9.2);
  float waveB = sin(dist * 0.055 - uTime * 5.8 + 1.2);
  float ringA = smoothstep(0.15, 0.75, abs(waveA));
  ringA *= 1.0 - smoothstep(0.72, 1.0, abs(waveA));
  float ringB = smoothstep(0.2, 0.9, abs(waveB)) * 0.55;

  float ripples = (ringA * 1.15 + ringB + softCore * 0.28) * falloff;
  float energy = ripples * uStrength * uIntensity;

  // Bleu ciel AFD — plus saturé sur fond blanc (uSkyBoost)
  vec3 skySoft = vec3(0.62, 0.86, 0.98);
  vec3 skyStrong = vec3(0.38, 0.78, 0.97);
  vec3 sky = mix(skySoft, skyStrong, clamp(uSkyBoost, 0.0, 1.0));
  vec3 highlight = mix(vec3(0.92, 0.97, 1.0), sky, 0.55 + uSkyBoost * 0.45);

  float alpha = energy * (0.32 + uSkyBoost * 0.28);
  alpha = clamp(alpha, 0.0, 0.55);

  if (alpha < 0.006) discard;
  gl_FragColor = vec4(highlight, alpha);
}
`;
