'use client';

import React, { useRef, useEffect } from 'react';
import { useContentStore } from '@/stores/contentStore';
import { useStyleStore } from '@/stores/styleStore';
import { useEffectsStore } from '@/stores/effectsStore';
import { Descendant } from 'slate';
import { generatePaperTexture } from '@/utils/paperTexture';
import jsPDF from 'jspdf';

const PreviewCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const content = useContentStore((state) => state.content);
  const style = useStyleStore();
  const effects = useEffectsStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pageSizes: { [key: string]: { width: number; height: number } } = {
      A4: { width: 794, height: 1123 },
      Letter: { width: 816, height: 1056 },
      Legal: { width: 816, height: 1344 },
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

    content.forEach((node: any) => {
      if (node.type === 'paragraph') {
        let line = '';
        node.children.forEach((text: any) => {
          text.text.split(' ').forEach((word: string) => {
            const testLine = line + word + ' ';
            const metrics = targetCtx.measureText(testLine);
            if (metrics.width > textWidth) {
              drawLine(targetCtx, line, style.margins.left, y, effects.handwritingRandomization, style.fontSize);
              line = word + ' ';
              y += style.fontSize * 1.2 + style.wordSpacing;
            } else {
              line = testLine;
            }
          });
        });
        if (line) {
          drawLine(targetCtx, line, style.margins.left, y, effects.handwritingRandomization, style.fontSize);
          y += style.fontSize * 1.2 + style.wordSpacing;
        }
        y += style.letterSpacing;
      }
      // Skip math for now
    });

    if (effects.shadowEnabled && offscreen && offCtx) {
      const shadowColor = `rgba(0, 0, 0, ${effects.shadowOpacity})`;
      ctx.filter = `drop-shadow(${offsetX}px ${offsetY}px ${effects.shadowBlur}px ${shadowColor})`;
      ctx.drawImage(offscreen, padL, padT);
      ctx.filter = 'none';
    }

    if (effects.scannerEnabled) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Contrast boost (1.2 factor)
      // Noise (small random)
      // Light bar gradient (faint vertical gradient)
      for (let i = 0; i < pixels.length; i += 4) {
        // Contrast
        pixels[i] = Math.min(255, Math.max(0, (pixels[i] - 128) * 1.2 + 128));     // red
        pixels[i + 1] = Math.min(255, Math.max(0, (pixels[i + 1] - 128) * 1.2 + 128)); // green
        pixels[i + 2] = Math.min(255, Math.max(0, (pixels[i + 2] - 128) * 1.2 + 128)); // blue

        // Add noise
        const noise = (Math.random() - 0.5) * 10;
        pixels[i] = Math.min(255, Math.max(0, pixels[i] + noise));
        pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + noise));
        pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + noise));

        // Light bar gradient (assuming vertical scan)
        const y = Math.floor((i / 4) / canvas.width);
        const gradient = (y / canvas.height) * 10 - 5; // subtle from -5 to 5
        pixels[i] = Math.min(255, Math.max(0, pixels[i] + gradient));
        pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + gradient));
        pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + gradient));
      }

      ctx.putImageData(imageData, 0, 0);
    }
  }, [content, style, effects]);

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

function drawLine(targetCtx: CanvasRenderingContext2D, line: string, x: number, y: number, randomize: boolean, fontSize: number) {
  let currentX = x;
  for (const char of line) {
    targetCtx.save();
    targetCtx.translate(currentX, y);
    if (randomize) {
      const rotation = (Math.random() - 0.5) * 0.05;
      const scale = 1 + (Math.random() - 0.5) * 0.05;
      const offsetY = (Math.random() - 0.5) * 0.5;
      targetCtx.rotate(rotation);
      targetCtx.scale(scale, scale);
      targetCtx.translate(0, offsetY);
    }
    targetCtx.fillText(char, 0, 0);
    targetCtx.restore();
    currentX += targetCtx.measureText(char).width;
  }
}

export default PreviewCanvas; 