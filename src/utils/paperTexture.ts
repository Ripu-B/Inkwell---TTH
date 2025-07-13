import React from 'react';

export function generatePaperTexture(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  randomNoise(canvas);
  perlinNoise(canvas);

  return canvas;
}

function randomNoise(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const value = Math.floor(Math.random() * 256);
    pixels[i] = value;
    pixels[i + 1] = value;
    pixels[i + 2] = value;
    pixels[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

function perlinNoise(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const offscreen = document.createElement('canvas');
  offscreen.width = canvas.width;
  offscreen.height = canvas.height;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return;

  randomNoise(offscreen);

  for (let size = 4; size <= Math.min(offscreen.width, offscreen.height); size *= 2) {
    const x = Math.floor(Math.random() * (offscreen.width - size));
    const y = Math.floor(Math.random() * (offscreen.height - size));

    ctx.globalAlpha = 4 / size;
    ctx.drawImage(offscreen, x, y, size, size, 0, 0, canvas.width, canvas.height);
  }

  ctx.globalAlpha = 1;
} 