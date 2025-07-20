// Debug script for WebGL and GPU issues
console.log('=== Real Bad Radio Debug Info ===');

// Check WebGL support
function checkWebGL() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) {
    console.warn('WebGL not supported');
    return false;
  }
  
  console.log('WebGL supported:', gl.getParameter(gl.VERSION));
  console.log('WebGL vendor:', gl.getParameter(gl.VENDOR));
  console.log('WebGL renderer:', gl.getParameter(gl.RENDERER));
  
  return true;
}

// Check for GPU acceleration
function checkGPUAcceleration() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      console.log('GPU:', gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
    }
  }
  
  // Check if hardware acceleration is enabled
  const testDiv = document.createElement('div');
  testDiv.style.transform = 'translateZ(0)';
  document.body.appendChild(testDiv);
  
  const transform = window.getComputedStyle(testDiv).transform;
  console.log('Hardware acceleration:', transform !== 'none');
  
  document.body.removeChild(testDiv);
}

// Check image loading
function checkImages() {
  const images = document.querySelectorAll('img');
  console.log('Total images:', images.length);
  
  images.forEach((img, index) => {
    console.log(`Image ${index + 1}:`, {
      src: img.src,
      loaded: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    });
  });
}

// Check for CSS animations
function checkAnimations() {
  const animatedElements = document.querySelectorAll('*');
  let animationCount = 0;
  
  animatedElements.forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.animationName !== 'none' || style.transitionProperty !== 'none') {
      animationCount++;
      console.log('Animated element:', el.tagName, {
        animation: style.animationName,
        transition: style.transitionProperty
      });
    }
  });
  
  console.log('Total animated elements:', animationCount);
}

// Run diagnostics
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== Running Diagnostics ===');
  checkWebGL();
  checkGPUAcceleration();
  checkImages();
  checkAnimations();
  
  // Monitor for errors
  window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
  });
  
  // Monitor for WebGL errors
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  if (gl) {
    gl.getError(); // Clear any existing errors
  }
});

console.log('Debug script loaded'); 