// Simple HTML5 Audio Player for Real Bad Radio
class AudioPlayer {
  constructor(streamUrl) {
    this.audio = new Audio(streamUrl);
    this.playBtn = document.getElementById('play-btn');
    this.pauseBtn = document.getElementById('pause-btn');
    this.isInitialized = false;
    this.isMuted = false;
    
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
  
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    // Always sync state
    if (this.audio.muted !== this.isMuted) {
      this.audio.muted = this.isMuted;
    }
    this.showNotification(this.isMuted ? 'Muted' : 'Unmuted');
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
    // Only handle shortcuts when not typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      return;
    }
    // Normalize key for mute
    const key = e.key.toLowerCase();
    switch (e.code) {
      case 'KeyP':
        e.preventDefault();
        if (this.audio.paused) {
          this.play();
        } else {
          this.pause();
        }
        this.showNotification(this.audio.paused ? 'Paused' : 'Playing');
        break;
      case 'KeyM':
        e.preventDefault();
        this.toggleMute();
        break;
      case 'KeyS':
        e.preventDefault();
        this.stop();
        this.showNotification('Stopped');
        break;
      case 'Space':
        e.preventDefault();
        if (this.audio.paused) {
          this.play();
        } else {
          this.pause();
        }
        break;
      case 'Equal': // '+' key without shift on some layouts
      // fallthrough to + key detection handled below
      break;
    }
    // Additional key detections outside switch to capture '+' and '-'
    if (e.key === '+' || (e.key === '=' && e.shiftKey)) {
      e.preventDefault();
      this.adjustVolume(0.05);
      return;
    }
    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      this.adjustVolume(-0.05);
      return;
    }
    // existing default case logic...
    switch (e.code) {
      default:
        // Also support 'm' and 'M' for mute
        if (key === 'm') {
          e.preventDefault();
          this.toggleMute();
        }
        break;
    }
  }

  adjustVolume(delta) {
    let newVol = Math.min(1, Math.max(0, this.audio.volume + delta));
    this.audio.volume = newVol;
    const pct = Math.round(newVol * 100);
    this.showNotification(`Volume: ${pct}%`);
  }
  
  showError(message) {
    this.showNotification(message, 'error');
  }
  
  showNotification(message, type = 'info') {
    // Create a notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0,0,0,0.8);
      color: #fff;
      padding: 8px 14px;
      border-radius: 4px;
      z-index: 1003;
      font-size: 14px;
      max-width: 280px;
      backdrop-filter: blur(4px);
      transition: opacity 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2500);
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
  
  isMuted() {
    return this.isMuted;
  }
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.audioPlayer = new AudioPlayer('https://stream.realbadradio.com/mpd.mp3');
}); 