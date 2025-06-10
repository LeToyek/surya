// src/utils/mathUtils.ts
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);