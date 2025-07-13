import html2canvas from 'html2canvas';

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
  
  // If no pages saved, add current page
  if (pages.length === 0) {
    const clonedPaper = paper.cloneNode(true) as HTMLElement;
    pages.push(clonedPaper);
  }
  
  // Get effects settings
  const scannerEnabled = paper.querySelector('.overlay.scanner') !== null;
  
  // Clear output first
  clearOutput();
  
  // Process each page
  for (const pagePaper of pages) {
    // Temporarily add the paper to the DOM for rendering
    pagePaper.style.position = 'absolute';
    pagePaper.style.left = '-9999px';
    document.body.appendChild(pagePaper);
    
    // Capture the paper with html2canvas
    const canvas = await html2canvas(pagePaper, { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });
    
    // Remove the temporary element
    document.body.removeChild(pagePaper);
    
    // Apply scanner effect if enabled
    if (scannerEnabled) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          applyContrastEffect(imageData, 0.55); // Increase contrast
          ctx.putImageData(imageData, 0, 0);
          
          // Apply a subtle noise effect
          const noiseCanvas = document.createElement('canvas');
          noiseCanvas.width = canvas.width;
          noiseCanvas.height = canvas.height;
          const noiseCtx = noiseCanvas.getContext('2d');
          
          if (noiseCtx) {
            const noiseData = noiseCtx.createImageData(canvas.width, canvas.height);
            const noiseBuffer = noiseData.data;
            
            // Generate noise
            for (let i = 0; i < noiseBuffer.length; i += 4) {
              const noise = Math.floor(Math.random() * 20) - 10;
              noiseBuffer[i] = noiseBuffer[i + 1] = noiseBuffer[i + 2] = noise;
              noiseBuffer[i + 3] = 10; // Low opacity
            }
            
            noiseCtx.putImageData(noiseData, 0, 0);
            
            // Overlay noise on main canvas
            ctx.globalAlpha = 0.2;
            ctx.drawImage(noiseCanvas, 0, 0);
            ctx.globalAlpha = 1.0;
          }
        } catch (error) {
          console.error('Failed to apply scanner effect:', error);
        }
      }
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
  }
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
  }
}; 