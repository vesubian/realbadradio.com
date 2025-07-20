// ArtworkFetcher implementation for Real Bad Radio
class ArtworkFetcher {
  constructor() {
    this.cache = new Map();
    // Insert your API keys below if you have them
    this.discogsKey = 'UFDjNqcnpwTNEbDcSZPVWYqaZxmewDDgqvtGNsfX';
    this.discogsSecret = '';
    this.disableDiscogs = true; // TEMP disable discogs source
    this.lastfmApiKey = '15a10b6514ed3a9147ae2cfa6e582845';
    // Google Custom Search API is not included for privacy and quota reasons
  }

  async fetchArtwork(trackInfo) {
    const cacheKey = `${trackInfo.artist}-${trackInfo.title}`;
    if (this.cache.has(cacheKey)) {
      console.log('ArtworkFetcher: Returning cached artwork');
      return this.cache.get(cacheKey);
    }
    let url = null;
    url = await this.fetchFromMusicBrainz(trackInfo);
    if (url) { console.log('ArtworkFetcher: Got artwork from MusicBrainz:', url); this.cache.set(cacheKey, url); return url; }
    if (!this.disableDiscogs) {
      url = await this.fetchFromDiscogs(trackInfo);
      if (url) { console.log('ArtworkFetcher: Got artwork from Discogs:', url); this.cache.set(cacheKey, url); return url; }
    }
    url = await this.fetchFromLastFM(trackInfo);
    if (url) { console.log('ArtworkFetcher: Got artwork from Last.fm:', url); this.cache.set(cacheKey, url); return url; }
    url = await this.fetchFromGoogleImages(trackInfo);
    if (url) { console.log('ArtworkFetcher: Got artwork from Google Images:', url); this.cache.set(cacheKey, url); return url; }
    console.log('ArtworkFetcher: No artwork found from any source');
    this.cache.set(cacheKey, null);
    return null;
  }

  async fetchFromMusicBrainz(trackInfo) {
    try {
      // Search for a release on MusicBrainz
      const searchUrl = `https://musicbrainz.org/ws/2/release/?query=artist:${encodeURIComponent(trackInfo.artist)}%20AND%20release:${encodeURIComponent(trackInfo.title)}&fmt=json`;
      const response = await fetch(searchUrl, { headers: { 'User-Agent': 'RealBadRadio/1.0' } });
      if (!response.ok) return null;
      const data = await response.json();
      if (data.releases && data.releases.length > 0) {
        const needle = trackInfo.title.toLowerCase();
        for (const release of data.releases) {
          if (!release.title || !release.id) continue;
          const titleMatch = release.title.toLowerCase().includes(needle);
          if (!titleMatch) continue; // ensure title matches track title
          const coverArtUrl = `https://coverartarchive.org/release/${release.id}/front-500.jpg`;
          const imgResp = await fetch(coverArtUrl, { method: 'HEAD' });
          if (imgResp.ok) return coverArtUrl;
        }
      }
      return null;
    } catch (error) {
      console.log('ArtworkFetcher: Error in fetchFromMusicBrainz:', error);
      return null;
    }
  }

  async fetchFromDiscogs(trackInfo) {
    try {
      // Use Discogs token if available
      if (!this.discogsKey) return null;
      const searchUrl = `https://api.discogs.com/database/search?q=${encodeURIComponent(trackInfo.fullTitle)}&type=release&token=${this.discogsKey}`;
      const response = await fetch(searchUrl);
      if (!response.ok) return null;
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        for (const result of data.results) {
          if (result.cover_image) {
            // Proxy via images.weserv.nl to avoid CORS issues
            const proxied = this.proxyImage(result.cover_image);
            return proxied;
          }
        }
      }
      return null;
    } catch (error) {
      console.log('ArtworkFetcher: Error in fetchFromDiscogs:', error);
      return null;
    }
  }

  // Helper to proxy external images through images.weserv.nl to bypass CORS
  proxyImage(url) {
    try {
      if (!url) return url;
      const stripped = url.replace(/^https?:\/\//, '');
      return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}`;
    } catch (e) {
      return url;
    }
  }

  async fetchFromLastFM(trackInfo) {
    try {
      if (!this.lastfmApiKey) return null;
      const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(trackInfo.artist)}&track=${encodeURIComponent(trackInfo.title)}&api_key=${this.lastfmApiKey}&format=json`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      let imageUrl = null;
      if (data && data.track && data.track.album && data.track.album.image) {
        const images = data.track.album.image;
        if (Array.isArray(images) && images.length > 0) {
          imageUrl = images[images.length - 1]['#text'] || images[0]['#text'];
        }
      }
      if (imageUrl && imageUrl.startsWith('http')) return this.proxyImage(imageUrl);
      return null;
    } catch (error) {
      console.log('ArtworkFetcher: Error in fetchFromLastFM:', error);
      return null;
    }
  }

  async fetchFromGoogleImages(trackInfo) {
    try {
      // Use DuckDuckGo as a public image search fallback (no API key required)
      // We'll use their "ia=images" endpoint and parse the first result
      const query = encodeURIComponent(`${trackInfo.artist} ${trackInfo.title} album cover`);
      const url = `https://duckduckgo.com/?q=${query}&iax=images&ia=images`;
      // Use a public proxy for demonstration (note: for production, use your own proxy)
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) return null;
      const data = await response.json();
      const html = data.contents;
      // Parse the first image src from the HTML
      const match = html.match(/<img[^>]+src="([^"]+)"[^>]*class="tile--img__img"/);
      if (match && match[1]) {
        let imgUrl = match[1];
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
        if (imgUrl.startsWith('http')) return this.proxyImage(imgUrl);
      }
      return null;
    } catch (error) {
      console.log('ArtworkFetcher: Error in fetchFromGoogleImages:', error);
      return null;
    }
  }
} 