// Enhanced Track Information System for Real Bad Radio
class TrackInfoManager {
  constructor() {
    this.currentTrack = null;
    this.artworkCache = new Map();
    this.init();
  }
  
  init() {
    // Initial call with a small delay to ensure DOM is ready
    setTimeout(() => {
      this.fetchTrackInfo();
    }, 100);
    
    // Update track info every 5 seconds
    setInterval(() => {
      this.fetchTrackInfo();
    }, 5000);
  }
  
  async fetchTrackInfo() {
    try {
      const response = await fetch('https://stream.realbadradio.com/title.js', {
        method: 'GET',
        mode: 'cors',
        timeout: 10000
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const text = await response.text();
      // Parse JSONP response
      const jsonMatch = text.match(/parseMusic\(({.*})\)/);
      if (jsonMatch) {
        const trackData = JSON.parse(jsonMatch[1]);
        await this.processTrackData(trackData);
      }
    } catch (error) {
      console.log('Error fetching track info:', error);
      this.showFallbackMessage();
    }
  }
  
  async processTrackData(trackData) {
    if (!trackData || !trackData.title) {
      this.showFallbackMessage();
      return;
    }
    
    const trackTitle = trackData.title;
    
    // Update basic track info
    this.updateTrackDisplay(trackTitle);
    
    // Fetch additional track information
    await this.fetchEnhancedTrackInfo(trackTitle);
  }
  
  async fetchEnhancedTrackInfo(trackTitle) {
    try {
      // Clean the track title for better search results
      const cleanTitle = this.cleanTrackTitle(trackTitle);
      
      // Try multiple sources for track information
      const trackInfo = await Promise.race([
        this.fetchFromDiscogs(cleanTitle),
        this.fetchFromMusicBrainz(cleanTitle),
        this.fetchFromLastFM(cleanTitle)
      ]);
      
      if (trackInfo) {
        this.displayEnhancedInfo(trackInfo);
      }
    } catch (error) {
      console.log('Error fetching enhanced track info:', error);
    }
  }
  
  async fetchFromDiscogs(trackTitle) {
    try {
      // Use Discogs API to get track information
      const searchUrl = `https://api.discogs.com/database/search?q=${encodeURIComponent(trackTitle)}&type=release&format=vinyl&key=YOUR_DISCOGS_KEY&secret=YOUR_DISCOGS_SECRET`;
      
      // For now, we'll use a simpler approach with the search URL
      const discogsSearchUrl = `https://www.discogs.com/search/?q=${encodeURIComponent(trackTitle)}&type=release`;
      document.getElementById("discogs-link").href = discogsSearchUrl;
      
      return {
        title: trackTitle,
        source: 'discogs',
        searchUrl: discogsSearchUrl
      };
    } catch (error) {
      console.log('Discogs fetch error:', error);
      return null;
    }
  }
  
  async fetchFromMusicBrainz(trackTitle) {
    try {
      const response = await fetch(`https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(trackTitle)}&fmt=json`, {
        headers: {
          'User-Agent': 'RealBadRadio/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.releases && data.releases.length > 0) {
          const release = data.releases[0];
          return {
            title: trackTitle,
            artist: release['artist-credit']?.[0]?.name || 'Unknown Artist',
            label: release.labels?.[0]?.name || 'Unknown Label',
            year: release.date?.substring(0, 4) || '',
            source: 'musicbrainz'
          };
        }
      }
    } catch (error) {
      console.log('MusicBrainz fetch error:', error);
    }
    return null;
  }
  
  async fetchFromLastFM(trackTitle) {
    try {
      // Parse artist and title from track title
      const parts = trackTitle.split(' - ');
      if (parts.length >= 2) {
        const artist = parts[0].trim();
        const title = parts.slice(1).join(' - ').trim();
        
        // Try to get artwork from Last.fm (would need API key in production)
        const lastfmUrl = `https://www.last.fm/music/${encodeURIComponent(artist)}/_/${encodeURIComponent(title)}`;
        
        return {
          title: title,
          artist: artist,
          source: 'lastfm',
          lastfmUrl: lastfmUrl
        };
      }
    } catch (error) {
      console.log('Last.fm fetch error:', error);
    }
    return null;
  }
  
  cleanTrackTitle(trackTitle) {
    // Remove common suffixes and clean up the title
    return trackTitle
      .replace(/ *\([^)]*\) */g, "") // Remove parentheses and content
      .replace(/ *\[[^\]]*\] */g, "") // Remove brackets and content
      .replace(/^\s+|\s+$/g, "") // Trim whitespace
      .replace(/\s+/g, " "); // Normalize spaces
  }
  
  updateTrackDisplay(trackTitle) {
    const trackElement = document.getElementById('track-title');
    if (trackElement) {
      trackElement.textContent = trackTitle;
    }
  }
  
  displayEnhancedInfo(trackInfo) {
    // Create or update the enhanced track info display
    let enhancedContainer = document.getElementById('enhanced-track-info');
    
    if (!enhancedContainer) {
      enhancedContainer = document.createElement('div');
      enhancedContainer.id = 'enhanced-track-info';
      enhancedContainer.className = 'enhanced-track-info';
      
      // Insert after the track title
      const trackContainer = document.querySelector('.track');
      if (trackContainer) {
        trackContainer.appendChild(enhancedContainer);
      }
    }
    
    // Build the enhanced display
    let html = '';
    
    if (trackInfo.artist) {
      html += `<div class="track-artist">${trackInfo.artist}</div>`;
    }
    
    if (trackInfo.label) {
      html += `<div class="track-label">${trackInfo.label}</div>`;
    }
    
    if (trackInfo.year) {
      html += `<div class="track-year">${trackInfo.year}</div>`;
    }
    
    if (trackInfo.artwork) {
      html += `<div class="track-artwork"><img src="${trackInfo.artwork}" alt="Album Artwork" /></div>`;
    }
    
    enhancedContainer.innerHTML = html;
  }
  
  showFallbackMessage() {
    const trackElement = document.getElementById('track-title');
    if (trackElement) {
      trackElement.textContent = 'Track information unavailable';
    }
  }
}

// Initialize track info manager when DOM is ready
$(document).ready(function() {
  window.trackInfoManager = new TrackInfoManager();
});
