// Simple HTML5 Audio Player for Real Bad Radio
class AudioPlayer {
  constructor(streamUrl) {
    this.audio = new Audio(streamUrl);
    this.playBtn = document.getElementById('play-btn');
    this.pauseBtn = document.getElementById('pause-btn');
    this.isInitialized = false;
    
    this.init();
  }
  
  init() {
    // Set audio properties
    this.audio.preload = 'none';
    this.audio.crossOrigin = 'anonymous';
    
    // Add event listeners
    this.playBtn.addEventListener('click', (e) => this.handlePlay(e));
    this.pauseBtn.addEventListener('click', (e) => this.handlePause(e));
    
    // Audio event listeners
    this.audio.addEventListener('play', () => this.updatePlayerState());
    this.audio.addEventListener('pause', () => this.updatePlayerState());
    this.audio.addEventListener('ended', () => this.updatePlayerState());
    this.audio.addEventListener('error', (e) => this.handleError(e));
    this.audio.addEventListener('loadstart', () => this.handleLoadStart());
    this.audio.addEventListener('canplay', () => this.handleCanPlay());
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Initialize player state
    this.updatePlayerState();
    this.isInitialized = true;
  }
  
  handlePlay(e) {
    e.preventDefault();
    this.play();
  }
  
  handlePause(e) {
    e.preventDefault();
    this.pause();
  }
  
  play() {
    this.audio.play().catch((error) => {
      console.log('Playback failed:', error);
      this.showError('Playback failed. Please try again.');
    });
  }
  
  pause() {
    this.audio.pause();
  }
  
  updatePlayerState() {
    if (this.audio.paused) {
      this.playBtn.style.display = 'inline-block';
      this.pauseBtn.style.display = 'none';
    } else {
      this.playBtn.style.display = 'none';
      this.pauseBtn.style.display = 'inline-block';
    }
  }
  
  handleError(e) {
    console.log('Audio error:', e);
    this.updatePlayerState();
    this.showError('Connection error. Please check your internet connection.');
  }
  
  handleLoadStart() {
    console.log('Audio loading started...');
  }
  
  handleCanPlay() {
    console.log('Audio ready to play');
  }
  
  handleKeydown(e) {
    // Spacebar to play/pause (except when typing in input fields)
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (this.audio.paused) {
        this.play();
      } else {
        this.pause();
      }
    }
  }
  
  showError(message) {
    // Create a simple error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      z-index: 1000;
      font-size: 14px;
      max-width: 300px;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }
  
  // Public methods for external control
  getAudioElement() {
    return this.audio;
  }
  
  isPlaying() {
    return !this.audio.paused;
  }
  
  getCurrentTime() {
    return this.audio.currentTime;
  }
  
  getDuration() {
    return this.audio.duration;
  }
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.audioPlayer = new AudioPlayer('https://stream.realbadradio.com/mpd.mp3');
}); 