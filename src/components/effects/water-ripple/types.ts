export type WaterRippleUniforms = {
  uTime: { value: number };
  uPointer: { value: [number, number] };
  uResolution: { value: [number, number] };
  uIntensity: { value: number };
  uRadius: { value: number };
  uStrength: { value: number };
};

export type WaterRippleProps = {
  intensity: number;
  radius: number;
  decayMs: number;
  maxDevicePixelRatio: number;
};
