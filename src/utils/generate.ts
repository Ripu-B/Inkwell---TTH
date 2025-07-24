import html2canvas from 'html2canvas';
import { useEffectsStore } from '@/stores/effectsStore';
import { useStyleStore } from '@/stores/styleStore';
import { generatePaperTexture } from './paperTexture';

// Store pages in memory
let pages: HTMLElement[] = [];

/**
 * Apply contrast to image data (for scanner effect)
 */
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

/**
 * Add current paper to pages array
 */
export const addPage = async () => {
  const paper = document.querySelector('.paper') as HTMLElement;
  if (!paper) return;
  
  // Clone the paper element
  const clonedPaper = paper.cloneNode(true) as HTMLElement;
  
  // Store the cloned paper in memory
  pages.push(clonedPaper);
  
  // Show notification
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
  notification.textContent = `Page ${pages.length} added`;
  document.body.appendChild(notification);
  
  // Remove notification after 2 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
};

/**
 * Generate image from paper content with effects
 */
export const generateImage = async () => {
  const paper = document.querySelector('.paper') as HTMLElement;
  if (!paper) return;
  
  // Set loading state
  const { setIsGenerating } = useEffectsStore.getState();
  setIsGenerating(true);
  
  try {
    // Always use a fresh clone of the current paper
    pages = []; // Clear old pages
    const clonedPaper = paper.cloneNode(true) as HTMLElement;
    pages.push(clonedPaper);
    
    // Get effects settings from the store
    const effects = useEffectsStore.getState();
    // Get style settings from the store
    const style = useStyleStore.getState();
    
    // Clear output first (remove all children only, don't add text)
    const output = document.getElementById('output');
    if (output) {
      while (output.firstChild) {
        output.removeChild(output.firstChild);
      }
    }
    
    // Add small delay to show loading
    await new Promise(resolve => setTimeout(resolve, 200));
  
  // Process each page
  for (const pagePaper of pages) {
    try {
      // Temporarily add the paper to the DOM for rendering
      pagePaper.style.position = 'absolute';
      pagePaper.style.left = '-9999px';
      document.body.appendChild(pagePaper);
      
      // Make sure all content is visible before rendering
      const editorElements = pagePaper.querySelectorAll('.slate-editor');
      editorElements.forEach(editor => {
        if (editor instanceof HTMLElement) {
          editor.style.visibility = 'visible';
          editor.style.display = 'block';
        }
      });
      
      // Ensure placeholders are properly displayed
      const placeholders = pagePaper.querySelectorAll('[data-slate-placeholder]');
      placeholders.forEach(placeholder => {
        if (placeholder instanceof HTMLElement) {
          placeholder.style.whiteSpace = 'normal';
          placeholder.style.display = 'inline-block';
        }
      });
      
      // Apply CSS classes for realism effects
      if (effects.paperGrainEnabled) {
        const paperGrain = document.createElement('div');
        paperGrain.className = 'paper-grain';
        paperGrain.style.opacity = effects.paperGrainIntensity.toString();
        pagePaper.appendChild(paperGrain);
      }
      
      if (effects.documentWeathering) {
        const weathering = document.createElement('div');
        weathering.className = 'document-weathering';
        weathering.style.opacity = effects.weatheringIntensity.toString();
        pagePaper.appendChild(weathering);
      }
      
      if (effects.noiseIntensity > 0) {
        const noise = document.createElement('div');
        noise.className = 'noise-overlay';
        noise.style.opacity = effects.noiseIntensity.toString();
        pagePaper.appendChild(noise);
      }
      
      if (effects.lightBarGradient) {
        const lightBar = document.createElement('div');
        lightBar.className = 'light-bar-gradient';
        pagePaper.appendChild(lightBar);
      }
      
      if (effects.bindingEffects) {
        const binding = document.createElement('div');
        binding.className = 'binding-effect';
        pagePaper.appendChild(binding);
        
        // Add binding holes
        const holeCount = 10;
        for (let i = 0; i < holeCount; i++) {
          const hole = document.createElement('div');
          hole.className = 'binding-hole';
          hole.style.top = `${(i + 1) * (100 / (holeCount + 1))}%`;
          pagePaper.appendChild(hole);
        }
      }
      
      // Apply text realism effects
      if (effects.inkFlowVariation) {
        const textElements = pagePaper.querySelectorAll('p, span:not(.ink-flow-text)');
        textElements.forEach(el => {
          if (el instanceof HTMLElement && el.innerText.trim()) {
            // Skip if this element has child spans with colors (to preserve them)
            const hasColoredChildren = el.querySelectorAll('span[style*="color"]').length > 0;
            if (hasColoredChildren) {
              // Process each text node separately to preserve colored spans
              const walker = document.createTreeWalker(
                el,
                NodeFilter.SHOW_TEXT,
                null
              );
              const textNodes: Text[] = [];
              let node;
              while (node = walker.nextNode()) {
                if (node.textContent && node.textContent.trim()) {
                  textNodes.push(node as Text);
                }
              }
              
              textNodes.forEach(textNode => {
                const parent = textNode.parentElement;
                if (parent && !parent.classList.contains('ink-flow-text')) {
                  const computedStyle = window.getComputedStyle(parent);
                  const inkColor = parent.style.color || computedStyle.color || style.inkColor;
                  let newSpans = '';
                  for (const char of textNode.textContent || '') {
                    const variation = (Math.random() - 0.5) * effects.inkFlowIntensity * 0.08;
                    const rotation = (Math.random() - 0.5) * effects.inkFlowIntensity * 3;
                    newSpans += `<span class="ink-flow-text" style="transform: scale(${1 + variation}) rotate(${rotation}deg); color: ${inkColor}; display: inline-block;">${char}</span>`;
                  }
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = newSpans;
                  while (tempDiv.firstChild) {
                    parent.insertBefore(tempDiv.firstChild, textNode);
                  }
                  textNode.remove();
                }
              });
            } else {
              // No colored children, process normally
              let newHTML = '';
              for (const char of el.innerText) {
                const variation = (Math.random() - 0.5) * effects.inkFlowIntensity * 0.08;
                const rotation = (Math.random() - 0.5) * effects.inkFlowIntensity * 3;
                const computedStyle = window.getComputedStyle(el);
                const inkColor = el.style.color || computedStyle.color || style.inkColor;
                newHTML += `<span class="ink-flow-text" style="transform: scale(${1 + variation}) rotate(${rotation}deg); color: ${inkColor}; display: inline-block;">${char}</span>`;
              }
              el.innerHTML = newHTML;
            }
          }
        });
      }
      
      if (effects.baselineWobbleEnabled) {
        const textElements = pagePaper.querySelectorAll('p, span:not(.baseline-wobble-span)');
        textElements.forEach(el => {
          if (el instanceof HTMLElement && el.innerText.trim()) {
            let newHTML = '';
            [...el.innerText].forEach((char, index) => {
              const wobble = Math.sin(index * 0.5 + Math.random() * 0.5) * effects.baselineWobbleIntensity * 2;
              // Preserve the original color of the element
              const computedStyle = window.getComputedStyle(el);
              const inkColor = el.style.color || computedStyle.color || style.inkColor;
              newHTML += `<span class="baseline-wobble-span" style="transform: translateY(${wobble}px); display: inline-block; color: ${inkColor};">${char}</span>`;
            });
            el.innerHTML = newHTML;
          }
        });
      }
      
      if (effects.fontSizeVariationEnabled) {
        const spans = pagePaper.querySelectorAll('span');
        spans.forEach(span => {
          if (span instanceof HTMLElement && Math.random() < 0.2) {
            const variation = (Math.random() - 0.5) * effects.fontSizeVariationIntensity;
            span.classList.add('font-size-variation');
            span.style.fontSize = `${parseFloat(window.getComputedStyle(span).fontSize) * (1 + variation)}px`;
            
            // Make sure color is preserved
            if (!span.style.color) {
              const computedColor = window.getComputedStyle(span).color;
              if (computedColor) {
                span.style.color = computedColor;
              }
            }
          }
        });
      }
      
      if (effects.penPressureVariation) {
        const spans = pagePaper.querySelectorAll('span');
        spans.forEach(span => {
          if (span instanceof HTMLElement && Math.random() < 0.3) {
            const pressure = 1 - Math.random() * effects.penPressureIntensity * 0.3;
            span.classList.add('pen-pressure-variation');
            span.style.opacity = (0.7 + pressure * 0.3).toString();
            span.style.textShadow = `0 0 ${Math.random() * effects.penPressureIntensity * 0.5}px`;
            
            // Make sure color is preserved
            if (!span.style.color) {
              const computedColor = window.getComputedStyle(span).color;
              if (computedColor) {
                span.style.color = computedColor;
              }
            }
          }
        });
      }
      
      // Capture the paper with html2canvas
      const canvas = await html2canvas(pagePaper, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        removeContainer: false,
        ignoreElements: (element) => {
          // Ignore elements that might cause problems
          return element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
        },
        onclone: (documentClone, element) => {
          // Additional processing on the cloned document
          const clonedEditors = documentClone.querySelectorAll('.slate-editor');
          clonedEditors.forEach(editor => {
            if (editor instanceof HTMLElement) {
              editor.style.visibility = 'visible';
              editor.style.opacity = '1';
            }
          });
        }
      });
      
      // Remove the temporary element
      if (document.body.contains(pagePaper)) {
        document.body.removeChild(pagePaper);
      }
      
      // Get canvas context for post-processing
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Create a copy of the canvas data before processing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
        }
        
        // Apply all enabled effects with proper state checking
        try {
          // Apply contrast boost
          if (effects.contrastBoost !== 1.0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            applyContrastEffect(imageData, effects.contrastBoost - 1.0);
            ctx.putImageData(imageData, 0, 0);
          }
          
          // Apply chromatic aberration only if enabled
          if (effects.chromaticAberration && effects.chromaticIntensity > 0) {
            applyChromaticAberration(ctx, canvas, effects.chromaticIntensity);
          }
          
          // Apply noise only if intensity > 0
          if (effects.noiseIntensity > 0) {
            applyNoiseEffect(ctx, canvas, effects.noiseIntensity);
          }
          
          // Apply light bar gradient only if enabled
          if (effects.lightBarGradient) {
            applyLightBarGradient(ctx, canvas);
          }
          
          // Apply document weathering only if enabled
          if (effects.documentWeathering && effects.weatheringIntensity > 0) {
            applyWeatheringEffect(ctx, canvas, effects.weatheringIntensity);
          }
          
          // Apply binding effects only if enabled
          if (effects.bindingEffects) {
            applyBindingEffects(ctx, canvas);
          }

          // Apply paper grain only if enabled
          if (effects.paperGrainEnabled && effects.paperGrainIntensity > 0) {
            applyPaperGrainEffect(ctx, canvas, effects.paperGrainIntensity);
          }
          
          // Add to output
          const imgData = canvas.toDataURL('image/png');
          const output = document.getElementById('output');
          if (output) {
            const img = document.createElement('img');
            img.src = imgData;
            img.className = 'generated-image';
            output.appendChild(img);
            
            // Add page number if multiple pages
            if (pages.length > 1) {
              const pageNumber = document.createElement('div');
              pageNumber.className = 'text-center text-sm text-gray-500 mb-4';
              pageNumber.textContent = `Page ${pages.indexOf(pagePaper) + 1} of ${pages.length}`;
              output.appendChild(pageNumber);
            }
          }
        } catch (error) {
          console.error('Failed to apply effects:', error);
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg';
      notification.textContent = 'Error generating image. Please try again.';
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  }
  
  // Scroll to output section
  const outputSection = document.getElementById('output');
  if (outputSection) {
    outputSection.scrollIntoView({ behavior: 'smooth' });
  }
  
  } catch (error) {
    console.error('Error in generateImage:', error);
    
    // Show error notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
    notification.textContent = 'Error generating image. Please try again.';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  } finally {
    // Always clear loading state
    setIsGenerating(false);
  }
};

/**
 * Apply chromatic aberration effect
 */
const applyChromaticAberration = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number): void => {
  // Skip if intensity is 0
  if (intensity === 0) return;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const newData = new Uint8ClampedArray(data);
  
  // Calculate offset based on intensity (0-1)
  const offset = Math.ceil(intensity * 3);
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const currentIndex = (y * canvas.width + x) * 4;
      
      // Red channel shifted left
      const redIndex = (y * canvas.width + Math.max(0, x - offset)) * 4;
      // Blue channel shifted right
      const blueIndex = (y * canvas.width + Math.min(canvas.width - 1, x + offset)) * 4;
      
      // Apply the shifted colors
      newData[currentIndex] = data[redIndex];         // Red
      // Green stays the same
      newData[currentIndex + 2] = data[blueIndex + 2]; // Blue
    }
  }
  
  // Create new ImageData and put it back
  const newImageData = new ImageData(newData, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
};

/**
 * Apply noise effect
 */
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
      const noise = Math.floor(Math.random() * 30 * intensity) - 15 * intensity;
      noiseBuffer[i] = noiseBuffer[i + 1] = noiseBuffer[i + 2] = noise;
      noiseBuffer[i + 3] = 20 * intensity; // Higher opacity, scaled by intensity
    }
    
    noiseCtx.putImageData(noiseData, 0, 0);
    
    // Overlay noise on main canvas
    ctx.globalAlpha = 0.3 * intensity;
    ctx.drawImage(noiseCanvas, 0, 0);
    ctx.globalAlpha = 1.0;
  }
};

/**
 * Apply light bar gradient effect
 */
const applyLightBarGradient = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void => {
  // Create a gradient from top to bottom
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  
  // Apply the gradient
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Apply document weathering effect
 */
const applyWeatheringEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number): void => {
  // Skip if intensity is 0
  if (intensity === 0) return;
  
  // Create some random stains and creases
  ctx.globalAlpha = 0.05 * intensity;
  
  // Add some yellowish tint to simulate aging
  ctx.fillStyle = `rgba(255, 240, 200, ${0.1 * intensity})`;
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

/**
 * Apply binding effects
 */
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

/**
 * Apply paper grain effect
 */
const applyPaperGrainEffect = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number): void => {
  // Skip if intensity is 0
  if (intensity === 0) return;
  
  const grainTexture = generatePaperTexture(canvas.width, canvas.height, intensity);
  
  // Apply grain texture with multiply blend mode
  ctx.globalAlpha = 0.4 * intensity;
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(grainTexture, 0, 0);
  
  // Reset composite operation and alpha
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1.0;
};

/**
 * Reset the pages array and clear output
 */
export const newDocument = () => {
  pages = [];
  clearOutput();
  
  // Show notification
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg';
  notification.textContent = 'New document created';
  document.body.appendChild(notification);
  
  // Remove notification after 2 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
};

/**
 * Download the current output as a PDF
 */
export const downloadAsPDF = async () => {
  // If no images generated yet, generate them first
  const output = document.getElementById('output');
  if (!output || !output.querySelector('img.generated-image')) {
    await generateImage();
  }
  
  try {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Get all images in the output
    const images = document.querySelectorAll('img.generated-image');
    
    if (images.length === 0) {
      alert('No images to download');
      return;
    }
    
    // Add each image to a new page
    images.forEach((img, index) => {
      if (index > 0) doc.addPage();
      
      const imgElement = img as HTMLImageElement;
      const imgData = imgElement.src;
      
      // Calculate dimensions to fit on PDF page
      const imgWidth = doc.internal.pageSize.getWidth();
      const imgHeight = (imgElement.height * imgWidth) / imgElement.width;
      
      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    });
    
    // Save the PDF
    doc.save('inkwell-document.pdf');
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

/**
 * Delete all generated images
 */
export const clearOutput = () => {
  const output = document.getElementById('output');
  if (output) {
    while (output.firstChild) {
      output.removeChild(output.firstChild);
    }
    // Add the default text back
    output.textContent = 'Generated output will appear here';
  }
};
