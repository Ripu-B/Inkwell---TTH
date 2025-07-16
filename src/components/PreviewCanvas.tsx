'use client';

import React, { useRef, useEffect } from 'react';
import { useContentStore } from '@/stores/contentStore';
import { useStyleStore } from '@/stores/styleStore';
import { useEffectsStore } from '@/stores/effectsStore';
import { generatePaperTexture } from '@/utils/paperTexture';
import jsPDF from 'jspdf';

const PreviewCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mainContent } = useContentStore();
  const style = useStyleStore();
  const effects = useEffectsStore();

  // Apply chromatic aberration effect
  const applyChromaticAberration = (ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number): void => {
    // Skip if intensity is 0
    if (intensity === 0) return;
    
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data);
    
    // Calculate offset based on intensity (0-1)
    const offset = Math.ceil(intensity * 3);
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const currentIndex = (y * w + x) * 4;
        
        // Red channel shifted left
        const redIndex = (y * w + Math.max(0, x - offset)) * 4;
        // Blue channel shifted right
        const blueIndex = (y * w + Math.min(w - 1, x + offset)) * 4;
        
        // Apply the shifted colors
        newData[currentIndex] = data[redIndex];         // Red
        // Green stays the same
        newData[currentIndex + 2] = data[blueIndex + 2]; // Blue
      }
    }
    
    // Create new ImageData and put it back
    const newImageData = new ImageData(newData, w, h);
    ctx.putImageData(newImageData, 0, 0);
  };

  const applyPaperGrain = (ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) => {
    if (intensity === 0) return;
    const grain = generatePaperTexture(w, h);
    ctx.save();
    ctx.globalAlpha = intensity;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(grain, 0, 0);
    ctx.restore();
  };

  const applyNoise = (ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) => {
    if (intensity === 0) return;
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity * 50;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
      data[i] = Math.max(0, Math.min(255, data[i]));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const applyLightBarGradient = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.1)');
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  };

  const applyDocumentWeathering = (ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) => {
    if (intensity === 0) return;
    ctx.save();
    ctx.globalAlpha = intensity;
    // Yellowing
    const yellowGradient = ctx.createLinearGradient(0, 0, 0, h);
    yellowGradient.addColorStop(0, 'rgba(0,0,0,0)');
    yellowGradient.addColorStop(1, 'rgba(255,255,200,0.3)');
    ctx.fillStyle = yellowGradient;
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillRect(0, 0, w, h);
    // Random stains
    for (let i = 0; i < 2; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 50 + Math.random() * 100;
      const stainGradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      stainGradient.addColorStop(0, 'rgba(139,69,19,0.2)');
      stainGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = stainGradient;
      ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    // Creases
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.lineTo(Math.random() * w, Math.random() * h);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Apply contrast to image data
  const applyContrastEffect = (imageData: ImageData, contrast: number): void => {
    const data = imageData.data;
    contrast *= 255;
    const factor = (contrast + 255) / (255.01 - contrast);
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = factor * (data[i] - 128) + 128;     // Red
      data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
      data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
    }
  };

  // Apply noise effect
  const applyNoiseEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number): void => {
    // Skip if intensity is 0
    if (intensity === 0) return;
    
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = canvas.width;
    noiseCanvas.height = canvas.height;
    const noiseCtx = noiseCanvas.getContext('2d');
    
    if (noiseCtx) {
      const noiseData = noiseCtx.createImageData(canvas.width, canvas.height);
      const noiseBuffer = noiseData.data;
      
      // Generate noise
      for (let i = 0; i < noiseBuffer.length; i += 4) {
        const noise = Math.floor(Math.random() * 20 * intensity) - 10 * intensity;
        noiseBuffer[i] = noiseBuffer[i + 1] = noiseBuffer[i + 2] = noise;
        noiseBuffer[i + 3] = 10 * intensity; // Low opacity, scaled by intensity
      }
      
      noiseCtx.putImageData(noiseData, 0, 0);
      
      // Overlay noise on main canvas
      ctx.globalAlpha = 0.2 * intensity;
      ctx.drawImage(noiseCanvas, 0, 0);
      ctx.globalAlpha = 1.0;
    }
  };

  // Apply light bar gradient effect
  const applyCanvasLightBarGradient = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Create a gradient from top to bottom
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    
    // Apply the gradient
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  };

  // Apply document weathering effect
  const applyWeatheringEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number): void => {
    // Skip if intensity is 0
    if (intensity === 0) return;
    
    // Create some random stains and creases
    ctx.globalAlpha = 0.05 * intensity;
    
    // Add some yellowish tint to simulate aging
    ctx.fillStyle = 'rgba(255, 240, 200, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some random stains
    const stainCount = Math.floor(intensity * 10);
    for (let i = 0; i < stainCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 50 * intensity + 10;
      const color = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 70)}, ${Math.floor(Math.random() * 40)}, ${Math.random() * 0.1 * intensity})`;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    
    // Add some creases
    const creaseCount = Math.floor(intensity * 5);
    for (let i = 0; i < creaseCount; i++) {
      const x1 = Math.random() * canvas.width;
      const y1 = Math.random() * canvas.height;
      const x2 = Math.random() * canvas.width;
      const y2 = Math.random() * canvas.height;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(100, 100, 100, ${Math.random() * 0.1 * intensity})`;
      ctx.lineWidth = Math.random() * 2 * intensity;
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1.0;
  };

  // Apply binding effects
  const applyBindingEffects = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void => {
    // Draw binding holes or spiral on the left side
    const holeCount = 10;
    const holeRadius = 8;
    const margin = 15;
    
    ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.8)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < holeCount; i++) {
      const y = (canvas.height / (holeCount + 1)) * (i + 1);
      
      // Draw hole
      ctx.beginPath();
      ctx.arc(margin, y, holeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Draw shadow
      ctx.beginPath();
      ctx.arc(margin + 1, y + 1, holeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fill();
      
      // Reset fill style
      ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pageSizes: { [key: string]: { width: number; height: number } } = {
      A4: { width: 794, height: 1123 },
      Letter: { width: 816, height: 1056 },
      Legal: { width: 816, height: 1344 },
      A5: { width: 559, height: 794 },
      Executive: { width: 696, height: 1008 },
    };

    const pageSize = pageSizes[style.pageSize] || { width: 794, height: 1123 };
    const pageW = pageSize.width;
    const pageH = pageSize.height;

    let targetCtx = ctx;
    let targetW = pageW;
    let targetH = pageH;
    let offscreen: HTMLCanvasElement | null = null;
    let offCtx: CanvasRenderingContext2D | null = null;
    let padL = 0;
    let padR = 0;
    let padT = 0;
    let padB = 0;
    let offsetX = 0;
    let offsetY = 0;

    if (effects.shadowEnabled) {
      const rad = effects.shadowAngle * Math.PI / 180;
      offsetX = effects.shadowDistance * Math.cos(rad);
      offsetY = effects.shadowDistance * Math.sin(rad);
      const blur = effects.shadowBlur;

      padL = Math.ceil(Math.max(0, -offsetX) + blur);
      padR = Math.ceil(Math.max(0, offsetX) + blur);
      padT = Math.ceil(Math.max(0, -offsetY) + blur);
      padB = Math.ceil(Math.max(0, offsetY) + blur);

      canvas.width = pageW + padL + padR;
      canvas.height = pageH + padT + padB;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Optional background for preview
      // ctx.fillStyle = '#f0f0f0';
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      offscreen = document.createElement('canvas');
      offscreen.width = pageW;
      offscreen.height = pageH;
      offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      targetCtx = offCtx;
      targetW = pageW;
      targetH = pageH;
    } else {
      canvas.width = pageW;
      canvas.height = pageH;
      ctx.clearRect(0, 0, pageW, pageH);
    }

    // Draw paper background
    targetCtx.fillStyle = style.paperColor;
    targetCtx.fillRect(0, 0, targetW, targetH);

    if (effects.textureStrength > 0) {
      targetCtx.save();
      targetCtx.globalAlpha = effects.textureStrength;
      targetCtx.globalCompositeOperation = 'multiply';
      const texture = generatePaperTexture(targetW, targetH);
      targetCtx.drawImage(texture, 0, 0);
      targetCtx.restore();
    }

    // Set font
    targetCtx.font = `${style.fontSize}px ${style.fontFamily}`;
    targetCtx.fillStyle = style.inkColor;

    let y = style.margins.top + style.fontSize;
    const textWidth = targetW - style.margins.left - style.margins.right;

    mainContent.forEach((node: any) => {
      if (node.type === 'paragraph') {
        let line = '';
        node.children.forEach((text: any) => {
          text.text.split(' ').forEach((word: string) => {
            const testLine = line + word + ' ';
            const metrics = targetCtx.measureText(testLine);
            if (metrics.width > textWidth) {
              drawLine(targetCtx, line, style.margins.left, y, effects, style.fontSize);
              line = word + ' ';
              y += style.fontSize * 1.2 + style.wordSpacing;
            } else {
              line = testLine;
            }
          });
        });
        if (line) {
          drawLine(targetCtx, line, style.margins.left, y, effects, style.fontSize);
          y += style.fontSize * 1.2 + style.wordSpacing;
        }
        y += style.letterSpacing;
      }
      // Skip math for now
    });

    if (effects.chromaticIntensity > 0) applyChromaticAberration(targetCtx, targetW, targetH, effects.chromaticIntensity);
    if (effects.paperGrainEnabled) applyPaperGrain(targetCtx, targetW, targetH, effects.paperGrainIntensity);
    if (effects.noiseIntensity > 0) applyNoise(targetCtx, targetW, targetH, effects.noiseIntensity);
    if (effects.lightBarGradient) applyCanvasLightBarGradient(targetCtx, targetW, targetH);
    if (effects.documentWeathering) applyDocumentWeathering(targetCtx, targetW, targetH, effects.weatheringIntensity);

    if (effects.shadowEnabled && offscreen && offCtx) {
      const shadowColor = `rgba(0, 0, 0, ${effects.shadowOpacity})`;
      ctx.filter = `drop-shadow(${offsetX}px ${offsetY}px ${effects.shadowBlur}px ${shadowColor})`;
      ctx.drawImage(offscreen, padL, padT);
      ctx.filter = 'none';
    }

    // Apply all realism effects
    try {
      // Apply contrast boost
      if (effects.contrastBoost !== 1.0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        applyContrastEffect(imageData, effects.contrastBoost - 1.0);
        ctx.putImageData(imageData, 0, 0);
      }
      
      // Apply chromatic aberration
      if (effects.chromaticAberration) {
        applyChromaticAberration(ctx, canvas.width, canvas.height, effects.chromaticIntensity);
      }
      
      // Apply noise
      if (effects.noiseIntensity > 0) {
        applyNoiseEffect(ctx, canvas, effects.noiseIntensity);
      }
      
      // Apply light bar gradient
      if (effects.lightBarGradient) {
        applyCanvasLightBarGradient(ctx, canvas.width, canvas.height);
      }
      
      // Apply document weathering
      if (effects.documentWeathering) {
        applyWeatheringEffect(ctx, canvas, effects.weatheringIntensity);
      }
      
      // Apply binding effects
      if (effects.bindingEffects) {
        applyBindingEffects(ctx, canvas);
      }
    } catch (error) {
      console.error('Failed to apply effects:', error);
    }
  }, [mainContent, style, effects]);

  return (
    <div>
      <canvas ref={canvasRef} className="border shadow-lg" />
      <button
        onClick={() => {
          const link = document.createElement('a');
          link.download = 'inkwell.png';
          link.href = canvasRef.current?.toDataURL('image/png') ?? '';
          link.click();
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Export PNG
      </button>
      <button
        onClick={() => {
          const formatMap: { [key: string]: string } = {
            A4: 'a4',
            Letter: 'letter',
            Legal: 'legal',
            A5: 'a5',
            Executive: 'executive',
          };
          const pdfFormat = formatMap[style.pageSize] || 'a4';
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: pdfFormat,
          });
          const imgData = canvasRef.current?.toDataURL('image/png') ?? '';
          pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
          pdf.save('inkwell.pdf');
        }}
        className="mt-4 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export PDF
      </button>
    </div>
  );
};

function drawLine(
  targetCtx: CanvasRenderingContext2D, 
  line: string, 
  x: number, 
  y: number, 
  effects: any, 
  fontSize: number
) {
  let currentX = x;
  for (const [i, char] of line.split('').entries()) {
    targetCtx.save();
    
    // Calculate baseline wobble
    const wobble = effects.baselineWobbleEnabled ? Math.sin(i * 0.5) * effects.baselineWobbleIntensity * 5 : 0;
    targetCtx.translate(currentX, y + wobble);
    
    if (effects.handwritingRandomization) {
      const rotation = (Math.random() - 0.5) * 0.05;
      const scale = 1 + (Math.random() - 0.5) * 0.05;
      const offsetY = (Math.random() - 0.5) * 0.5;
      targetCtx.rotate(rotation);
      targetCtx.scale(scale, scale);
      targetCtx.translate(0, offsetY);
    }
    
    // Apply pen pressure variation if enabled
    if (effects.penPressureVariation) {
      const pressure = 1 - Math.random() * effects.penPressureIntensity * 0.3;
      targetCtx.globalAlpha = 0.7 + pressure * 0.3;
      
      // Simulate pen pressure by varying the font weight
      const weight = Math.floor(400 + pressure * 200);
      const fontParts = targetCtx.font.split(' ');
      if (fontParts.length > 1) {
        fontParts[0] = `${weight}`;
        targetCtx.font = fontParts.join(' ');
      }
      
      // Add subtle text shadow for ink bleed effect
      const bleedAmount = Math.random() * effects.penPressureIntensity * 0.5;
      targetCtx.shadowColor = targetCtx.fillStyle.toString();
      targetCtx.shadowBlur = bleedAmount;
    }
    
    // Apply font size variation
    if (effects.fontSizeVariationEnabled && Math.random() < 0.1) {
      const variation = (Math.random() - 0.5) * effects.fontSizeVariationIntensity * 0.5;
      targetCtx.font = `${fontSize * (1 + variation)}px ${targetCtx.font.split('px ')[1]}`;
    }
    
    targetCtx.fillText(char, 0, 0);
    targetCtx.restore();
    currentX += targetCtx.measureText(char).width;
  }
}

export default PreviewCanvas; 