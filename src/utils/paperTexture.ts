import React from 'react';

export function generatePaperTexture(width: number, height: number, intensity: number = 0.3): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  randomNoise(canvas, intensity);
  perlinNoise(canvas, intensity);

  return canvas;
}

function randomNoise(canvas: HTMLCanvasElement, intensity: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    // Create subtle variations in the paper texture
    const variation = Math.random() * 15 * intensity;
    const value = 235 - variation; // Light base color with subtle variations
    pixels[i] = value;
    pixels[i + 1] = value;
    pixels[i + 2] = value;
    pixels[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

function perlinNoise(canvas: HTMLCanvasElement, intensity: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const offscreen = document.createElement('canvas');
  offscreen.width = canvas.width;
  offscreen.height = canvas.height;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return;

  randomNoise(offscreen, intensity);

  // Apply multiple layers of noise at different scales for more realistic texture
  for (let size = 4; size <= Math.min(offscreen.width, offscreen.height); size *= 2) {
    const x = Math.floor(Math.random() * (offscreen.width - size));
    const y = Math.floor(Math.random() * (offscreen.height - size));

    ctx.globalAlpha = (4 / size) * intensity;
    ctx.drawImage(offscreen, x, y, size, size, 0, 0, canvas.width, canvas.height);
  }

  // Add some fiber-like texture
  addFiberTexture(canvas, intensity);

  ctx.globalAlpha = 1;
}

function addFiberTexture(canvas: HTMLCanvasElement, intensity: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.globalAlpha = 0.05 * intensity;
  
  // Add some horizontal and vertical fibers
  const fiberCount = Math.floor(canvas.width * 0.2 * intensity);
  
  for (let i = 0; i < fiberCount; i++) {
    const y = Math.floor(Math.random() * canvas.height);
    const width = Math.random() * 1.5 * intensity + 0.5;
    
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.lineWidth = width;
    ctx.strokeStyle = `rgba(200, 200, 200, ${0.1 * intensity})`;
    ctx.stroke();
  }
  
  for (let i = 0; i < fiberCount; i++) {
    const x = Math.floor(Math.random() * canvas.width);
    const width = Math.random() * 1.5 * intensity + 0.5;
    
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.lineWidth = width;
    ctx.strokeStyle = `rgba(200, 200, 200, ${0.1 * intensity})`;
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1;
} 