export const waterRippleVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Ondes radiales très subtiles — presque transparentes.
 * Pas de teinte bleue opaque ; reflets doux + légère réfraction simulée.
 */
export const waterRippleFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform float uIntensity;
uniform float uRadius;
uniform float uStrength;
varying vec2 vUv;

void main() {
  vec2 pixel = vUv * uResolution;
  vec2 center = uPointer;
  float dist = distance(pixel, center);
  float radius = max(uRadius, 40.0);

  float falloff = 1.0 - smoothstep(radius * 0.15, radius, dist);
  float wave = sin(dist * 0.085 - uTime * 6.5) * 0.5 + 0.5;
  float ring = smoothstep(0.35, 0.55, wave) * smoothstep(0.85, 0.55, wave);

  float energy = falloff * ring * uStrength * uIntensity;
  vec3 highlight = vec3(1.0, 1.0, 1.0);
  float alpha = energy * 0.18;

  // Légère variation chromatique locale (très faible)
  float chroma = energy * 0.04;
  vec3 color = highlight * (0.92 + chroma);

  if (alpha < 0.004) discard;
  gl_FragColor = vec4(color, alpha);
}
`;
