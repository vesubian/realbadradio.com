// Enhanced Track Information System for Real Bad Radio
class EnhancedTrackInfo {
  constructor() {
    this.currentTrack = null;
    this.artworkCache = new Map();
    this.currentArtworkUrl = null;
    this.init();
  }
  
  init() {
    console.log('TrackInfo: Initializing...');
    this.createTrackInfoPanel();
    setTimeout(() => {
      console.log('TrackInfo: Starting initial track info fetch...');
      this.fetchTrackInfo();
    }, 100);
    setInterval(() => {
      this.fetchTrackInfo();
    }, 5000);
    console.log('TrackInfo: Initialization complete');
  }

  createTrackInfoPanel() {
    console.log('TrackInfo: Creating track info panel...');
    // Remove old panel if exists
    const oldPanel = document.getElementById('track-info-panel');
    if (oldPanel) oldPanel.remove();
    // Minimal panel: only artwork and icon links
    const panel = document.createElement('div');
    panel.id = 'track-info-panel';
    panel.className = 'track-info-panel minimal';
    panel.style.opacity = '0';
    panel.style.pointerEvents = 'none';
    panel.style.transition = 'opacity 0.6s cubic-bezier(.4,2,.6,1)';
    panel.innerHTML = `
      <div class="track-info-content minimal">
        <div class="track-artwork-container minimal" style="position:relative;">
          <img src="" alt="Album Artwork" class="track-artwork-image minimal" id="main-artwork-img" crossorigin="anonymous" style="display:none; opacity:0; position:relative; z-index:2; transition:opacity 0.7s cubic-bezier(.4,2,.6,1);" />
          <img src="" alt="Previous Artwork" class="track-artwork-image minimal" id="prev-artwork-img" crossorigin="anonymous" style="display:none; opacity:0; position:absolute; left:0; top:0; z-index:1; transition:opacity 0.7s cubic-bezier(.4,2,.6,1); pointer-events:none;" />
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    panel.style.opacity = '1';
    panel.style.visibility = 'visible';
    panel.style.pointerEvents = 'auto';
    // Do NOT call adjustArtworkPanelVisibility here
    // Remove these lines, as the elements no longer exist:
    // document.getElementById('discogs-link-icon').innerHTML = ...
    // document.getElementById('lastfm-link-icon').innerHTML = ...
    // Place at bottom right, responsive
    // Responsive sizing
    // Remove the resizeArtwork function and all calls to it
    // window.addEventListener('resize', resizeArtwork);
    // resizeArtwork();
    // Debug
    console.log('TrackInfo: Track info panel created and appended to body');
  }

  async fetchTrackInfo() {
    const script = document.createElement('script');
    script.src = 'https://stream.realbadradio.com/title.js';
    script.onload = () => {
      if (window.lastTrackData) {
        this.processTrackData(window.lastTrackData);
      }
    };
    script.onerror = () => {
      console.log('Error loading track info');
      this.showFallbackMessage();
    };
    const existingScript = document.querySelector('script[src*="title.js"]');
    if (existingScript) existingScript.remove();
    document.head.appendChild(script);
  }

  processTrackData(trackData) {
    if (!trackData || !trackData.title) {
      this.showFallbackMessage();
      return;
    }
    const trackTitle = trackData.title;
    this.updateTrackDisplay(trackTitle);
    this.fetchEnhancedTrackInfo(trackTitle);
  }

  async fetchEnhancedTrackInfo(trackTitle) {
    try {
      const cleanTitle = this.cleanTrackTitle(trackTitle);
      const trackInfo = this.parseTrackInfo(cleanTitle);
      if (trackInfo) {
        this.displayEnhancedInfo(trackInfo);
        await this.fetchAlbumArtwork(trackInfo);
      }
    } catch (error) {
      console.log('Error fetching enhanced track info:', error);
    }
  }

  async fetchAlbumArtwork(trackInfo) {
    try {
      if (window.artworkFetcher) {
        const artworkUrl = await window.artworkFetcher.fetchArtwork(trackInfo);
        if (artworkUrl) {
          this.crossfadeArtwork(artworkUrl, trackInfo);
        } else {
          this.hideArtworkPanel();
        }
      } else {
        this.hideArtworkPanel();
      }
    } catch (error) {
      this.hideArtworkPanel();
    }
  }
  
  async fetchArtworkFromDiscogs(trackInfo) {
    try {
      // Use Discogs search API to find releases
      const searchUrl = `https://api.discogs.com/database/search?q=${encodeURIComponent(trackInfo.fullTitle)}&type=release&format=vinyl&key=YOUR_DISCOGS_KEY&secret=YOUR_DISCOGS_SECRET`;
      
      // For now, we'll use a simpler approach with the search URL
      // In production, you'd need a Discogs API key
      return null;
    } catch (error) {
      console.log('Discogs artwork fetch error:', error);
      return null;
    }
  }
  
  async fetchArtworkFromLastFM(trackInfo) {
    try {
      if (trackInfo.artist && trackInfo.title) {
        // Last.fm API would require an API key
        // For now, we'll use a placeholder approach
        const lastfmUrl = `https://www.last.fm/music/${encodeURIComponent(trackInfo.artist)}/_/${encodeURIComponent(trackInfo.title)}`;
        return null;
      }
    } catch (error) {
      console.log('Last.fm artwork fetch error:', error);
    }
    return null;
  }
  
  async fetchArtworkFromGoogle(trackInfo) {
    try {
      // Use Google Custom Search API for images
      const searchQuery = `${trackInfo.artist} ${trackInfo.title} album cover`;
      const apiKey = 'YOUR_GOOGLE_API_KEY'; // Would need Google API key
      const searchEngineId = 'YOUR_SEARCH_ENGINE_ID';
      
      // For now, we'll use a fallback approach
      return this.getFallbackArtwork(trackInfo);
    } catch (error) {
      console.log('Google artwork fetch error:', error);
      return this.getFallbackArtwork(trackInfo);
    }
  }
  
  async fetchArtworkFromBandcamp(trackInfo) {
    try {
      // Bandcamp doesn't have a public API, but we can try to find artist pages
      const bandcampUrl = `https://bandcamp.com/search?q=${encodeURIComponent(trackInfo.artist)}`;
      return null;
    } catch (error) {
      console.log('Bandcamp artwork fetch error:', error);
      return null;
    }
  }
  
  getFallbackArtwork(trackInfo) {
    // Generate a colorful placeholder based on artist/title
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    const color = colors[Math.abs(trackInfo.artist.length + trackInfo.title.length) % colors.length];
    
    // Create a data URL for a simple colored background with text
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 300, 300);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(trackInfo.artist.substring(0, 15), 150, 120);
    ctx.fillText(trackInfo.title.substring(0, 20), 150, 150);
    
    return canvas.toDataURL();
  }

  crossfadeArtwork(newUrl, trackInfo) {
    const panel = document.getElementById('track-info-panel');
    if (!panel) return;
    const mainImg = document.getElementById('main-artwork-img');
    const prevImg = document.getElementById('prev-artwork-img');
    if (this.currentArtworkUrl === newUrl) {
      // No change, just ensure visible
      if (mainImg) {
        mainImg.style.display = 'block';
        mainImg.style.opacity = '1';
      }
      panel.style.opacity = '1';
      panel.style.pointerEvents = 'auto';
      panel.style.visibility = 'visible';
      console.log('Artwork panel and image shown (no change).');
      adjustArtworkPanelVisibility();
      return;
    }
    // Crossfade: show prev, load new, fade out prev, fade in new
    if (mainImg && prevImg) {
      prevImg.src = this.currentArtworkUrl || '';
      prevImg.style.display = this.currentArtworkUrl ? 'block' : 'none';
      prevImg.style.opacity = this.currentArtworkUrl ? '1' : '0';
      mainImg.style.opacity = '0';
      mainImg.style.display = 'block';
      // Ensure crossorigin is set before setting src
      mainImg.setAttribute('crossorigin', 'anonymous');
      mainImg.src = newUrl;
      mainImg.onload = () => {
        console.log('Artwork image loaded and shown:', newUrl);
        setTimeout(() => {
          mainImg.style.opacity = '1';
          prevImg.style.opacity = '0';
        }, 30);
        setTimeout(() => {
          prevImg.style.display = 'none';
        }, 700);
        this.setBackgroundFromArtwork(mainImg);
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
        panel.style.pointerEvents = 'auto';
        mainImg.style.display = 'block';
        mainImg.style.opacity = '1';
        adjustArtworkPanelVisibility();
      };
      mainImg.onerror = () => {
        console.log('Artwork image failed to load (onerror):', newUrl);
        mainImg.style.display = 'none';
        mainImg.style.opacity = '0';
        // Do NOT hide the whole panel, just the image
      };
    }
    this.currentArtworkUrl = newUrl;
    // Show links
    const discogsLink = document.getElementById('discogs-link-icon');
    const lastfmLink = document.getElementById('lastfm-link-icon');
    if (discogsLink) discogsLink.style.display = 'inline-flex';
    if (lastfmLink) lastfmLink.style.display = 'inline-flex';
  }

  hideArtworkPanel() {
    // Only hide the image, not the panel
    const mainImg = document.getElementById('main-artwork-img');
    if (mainImg) mainImg.style.display = 'none';
    if (mainImg) mainImg.classList.remove('mini');
    document.body.style.background = '';
    document.body.style.backdropFilter = '';
    this.currentArtworkUrl = null;
  }

  async setBackgroundFromArtwork(img) {
    try {
      const color = await this.getDominantColor(img);
      if (color) {
        // White base, faint color overlay
        document.body.style.transition = 'background 0.8s cubic-bezier(.4,2,.6,1)';
        document.body.style.background = `linear-gradient(rgba(${color[0]},${color[1]},${color[2]},0.08), rgba(255,255,255,0.96))`;
        document.body.style.backdropFilter = 'blur(18px)';
      }
    } catch (e) {
      // fallback: do nothing
    }
  }

  async getDominantColor(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 100;
    canvas.height = img.naturalHeight || 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4 * 32) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
    return [r, g, b];
  }

  parseTrackInfo(trackTitle) {
    // Try to parse "Artist - Title" format
    const parts = trackTitle.split(' - ');
    if (parts.length >= 2) {
      const artist = parts[0].trim();
      const title = parts.slice(1).join(' - ').trim();
      
      return {
        title: title,
        artist: artist,
        fullTitle: trackTitle,
        discogsUrl: `https://www.discogs.com/search/?q=${encodeURIComponent(trackTitle)}&type=release`,
        lastfmUrl: `https://www.last.fm/music/${encodeURIComponent(artist)}/_/${encodeURIComponent(title)}`
      };
    }
    
    // If no artist separator found, treat as title only
    return {
      title: trackTitle,
      artist: 'Unknown Artist',
      fullTitle: trackTitle,
      discogsUrl: `https://www.discogs.com/search/?q=${encodeURIComponent(trackTitle)}&type=release`
    };
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
    const discogsLink = document.getElementById('discogs-link');
    if (discogsLink) {
      const cleanTitle = this.cleanTrackTitle(trackTitle);
      discogsLink.href = `https://www.discogs.com/search/?q=${encodeURIComponent(cleanTitle)}&type=release`;
      // Try to upgrade link asynchronously
      this.updateReleaseLink(cleanTitle, discogsLink);
    }
  }

  async updateReleaseLink(cleanTitle, linkEl) {
<<<<<<< HEAD
=======
    // 1. Try Bandcamp first (temporary priority)
    const bc = await this.getBandcampLink(cleanTitle);
    if (bc) {
      linkEl.href = bc;
      return;
    }
    /* Discogs lookup temporarily disabled for testing
>>>>>>> 7dd51a1 ( On branch main)
    try {
      const token = window.artworkFetcher ? window.artworkFetcher.discogsKey : null;
      if (token) {
        const searchUrl = `https://api.discogs.com/database/search?q=${encodeURIComponent(cleanTitle)}&type=release&token=${token}`;
        const resp = await fetch(searchUrl);
        if (resp.ok) {
          const data = await resp.json();
          if (data.results && data.results.length > 0) {
            let uri = data.results[0].uri;
            if (!uri && data.results[0].resource_url) {
              uri = data.results[0].resource_url.replace('https://api.discogs.com/releases/','https://www.discogs.com/release/');
            }
<<<<<<< HEAD
            if (!uri) return;
            if (!/^https?:\/\//i.test(uri)) {
              if (!uri.startsWith('/')) uri = '/' + uri;
              uri = 'https://www.discogs.com' + uri;
            }
            linkEl.href = uri;
            return; // success
          }
        }
      }
    } catch(e){/* continue to bandcamp */}
    // Try to fetch a Bandcamp release/track link
    const bc = await this.getBandcampLink(cleanTitle);
    if (bc) {
      linkEl.href = bc;
    } else {
      // fallback to Bandcamp search
      linkEl.href = `https://bandcamp.com/search?q=${encodeURIComponent(cleanTitle)}`;
    }
  }

  async getBandcampLink(query) {
    try {
      const ddgUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query + ' site:bandcamp.com')}`;
      const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(ddgUrl)}`;
      const resp = await fetch(proxy);
      if (!resp.ok) return null;
      const data = await resp.json();
      const html = data.contents;
      const match = html.match(/<a[^>]+href="(https?:\/\/[^\"]*bandcamp\.com[^\"]+)"/i);
      if (match && match[1]) {
        let url = match[1];
        // Unescape HTML entities
        url = url.replace(/&amp;/g, '&');
        return url;
      }
      return null;
    } catch(e){ return null; }
  }
=======
            if (uri) {
              if (!/^https?:\/\//i.test(uri)) {
                if (!uri.startsWith('/')) uri = '/' + uri;
                uri = 'https://www.discogs.com' + uri;
              }
              linkEl.href = uri;
              return;
            }
          }
        }
      }
    } catch(e){ }
    */
    // 3. Ultimate fallback: Bandcamp search
    linkEl.href = `https://bandcamp.com/search?q=${encodeURIComponent(cleanTitle)}`;
  }

  async getBandcampLink (query) {
    // --- Bandcamp search page ---
    try {
      const bcSearch = 'https://bandcamp.com/search'
                     + '?item_type=t&q=' + encodeURIComponent(query);
      const proxy    = 'https://api.allorigins.win/get?url=' + encodeURIComponent(bcSearch);

      const r = await fetch(proxy);
      if (!r.ok) throw new Error();
      const html = (await r.json()).contents;
      const m    = html.match(/<a[^>]+class="itemurl"[^>]+href="([^"]+)"/i);
      if (m) return m[1];
    } catch { /* ignore */ }

    // --- fallback generic search link ---
    return null;
  }

  async scrapeDuckDuckGo(query){
     try {
       const ddgUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query + ' site:bandcamp.com')}`;
       const resp = await fetch(`https://r.jina.ai/http://textise dot iitty?url=${encodeURIComponent(ddgUrl)}`);
       if(!resp.ok) return null;
       const text = await resp.text();
       const regex = /https?:\/\/[^"'\s>]*bandcamp\.com\/(?:track|album)\/[^"'\s<>]+/i;
       const m = text.match(regex);
       return m ? m[0] : null;
     }catch(e){return null;}
   }
>>>>>>> 7dd51a1 ( On branch main)
  
  displayEnhancedInfo(trackInfo) {
    // No longer update Discogs/Last.fm icons here
  }
  
  showFallbackMessage() {
    const trackElement = document.getElementById('track-title');
    if (trackElement) {
      trackElement.textContent = 'Track information unavailable';
    }
    
    const titleElement = document.querySelector('.track-title-main');
    if (titleElement) {
      titleElement.textContent = 'Track information unavailable';
    }
  }
}

// Global function for JSONP callback
window.parseMusic = function(data) {
  window.lastTrackData = data;
  if (window.trackInfoManager) {
    window.trackInfoManager.processTrackData(data);
  }
};

// Initialize track info manager when DOM is ready
$(document).ready(function() {
  console.log('TrackInfo: DOM ready, initializing...');
  
  // Initialize artwork fetcher
  console.log('TrackInfo: Creating ArtworkFetcher...');
  window.artworkFetcher = new ArtworkFetcher();
  console.log('TrackInfo: ArtworkFetcher created:', !!window.artworkFetcher);
  
  // Initialize track info manager
  console.log('TrackInfo: Creating EnhancedTrackInfo...');
  window.trackInfoManager = new EnhancedTrackInfo();
  console.log('TrackInfo: EnhancedTrackInfo created:', !!window.trackInfoManager);
}); 

function adjustArtworkPanelVisibility() {
  const panel = document.getElementById('track-info-panel');
  const footer = document.getElementById('footer');
  const img = document.getElementById('main-artwork-img');
  if (!panel || !footer || !img || img.style.display === 'none') return;
  const panelRect = panel.getBoundingClientRect();
  const footerRect = footer.getBoundingClientRect();
  const buffer = 4;
  // Try normal size first
  img.classList.remove('mini');
  let fits = panelRect.bottom + buffer < footerRect.top;
  console.log('adjustArtworkPanelVisibility:', {
    panelBottom: panelRect.bottom,
    footerTop: footerRect.top,
    buffer,
    fitsNormal: fits
  });
  if (!fits) {
    // Try mini size
    img.classList.add('mini');
    const miniPanelRect = panel.getBoundingClientRect();
    fits = miniPanelRect.bottom + buffer < footerRect.top;
    console.log('adjustArtworkPanelVisibility (mini):', {
      miniPanelBottom: miniPanelRect.bottom,
      footerTop: footerRect.top,
      buffer,
      fitsMini: fits
    });
    // TEMP: For debugging, always show the image
    // if (!fits) {
    //   img.style.display = 'none';
    //   img.classList.remove('mini');
    //   console.log('Artwork image hidden due to overlap with footer (even mini).');
    //   return;
    // }
  }
  img.style.display = 'block';
  img.style.opacity = '1';
  panel.style.visibility = 'visible';
  panel.style.opacity = '1';
  panel.style.pointerEvents = 'auto';
  console.log('Artwork panel and image shown (normal or mini).');
}
let resizeTimeout = null;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(adjustArtworkPanelVisibility, 100);
}); 