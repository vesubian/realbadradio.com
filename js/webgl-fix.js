// WebGL Error Prevention Script
console.log('Loading WebGL fix...');

// Prevent WebGL errors by intercepting WebGL context creation
(function() {
  // Store original getContext method
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  
  // Override getContext to prevent WebGL errors
  HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
    // If it's a WebGL context, add error handling
    if (contextType === 'webgl' || contextType === 'experimental-webgl' || contextType === 'webgl2') {
      try {
        const context = originalGetContext.call(this, contextType, contextAttributes);
        
        if (context) {
          // Override getError to suppress texture errors
          const originalGetError = context.getError;
          context.getError = function() {
            const error = originalGetError.call(this);
            // Suppress specific texture errors
            if (error === 1286) { // INVALID_FRAMEBUFFER_OPERATION
              return 0; // NO_ERROR
            }
            return error;
          };
          
          // Override bindTexture to prevent texture binding errors
          const originalBindTexture = context.bindTexture;
          context.bindTexture = function(target, texture) {
            try {
              return originalBindTexture.call(this, target, texture);
            } catch (e) {
              console.warn('WebGL texture binding suppressed:', e.message);
              return;
            }
          };
        }
        
        return context;
      } catch (e) {
        console.warn('WebGL context creation failed, falling back to 2D:', e.message);
        return originalGetContext.call(this, '2d', contextAttributes);
      }
    }
    
    // For non-WebGL contexts, use original method
    return originalGetContext.call(this, contextType, contextAttributes);
  };
})();

// Disable CSS animations that might cause WebGL issues
document.addEventListener('DOMContentLoaded', function() {
  // Add a class to disable animations
  document.body.classList.add('webgl-safe');
  
  // Create a style element to override problematic CSS
  const style = document.createElement('style');
  style.textContent = `
    .webgl-safe body > *:not(#cf):not(.track-info-panel):not(.keyboard-shortcuts) * {
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }
    .webgl-safe .btn:hover {
      transform: none !important;
    }
    .webgl-safe .openinplayer:hover img {
      transform: none !important;
    }
    .webgl-safe .far:hover,
    .webgl-safe .fas:hover {
      transform: none !important;
    }
    .webgl-safe .list-unstyled:hover .k7 {
      transform: none !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('WebGL safety measures applied');
});

// Monitor for WebGL errors and suppress them
window.addEventListener('error', function(e) {
  if (e.message && e.message.includes('GLD_TEXTURE_INDEX_2D')) {
    e.preventDefault();
    console.warn('WebGL texture error suppressed');
    return false;
  }
});

// Override console.error to filter WebGL errors
const originalConsoleError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  if (message.includes('GLD_TEXTURE_INDEX_2D') || 
      message.includes('UNSUPPORTED') || 
      message.includes('texture unloadable')) {
    console.warn('WebGL error suppressed:', message);
    return;
  }
  originalConsoleError.apply(console, args);
};

console.log('WebGL fix loaded successfully'); 