# Real Bad Radio

A simple, modern web radio player for Real Bad Radio.

## Features

- 🎵 **HTML5 Audio Player** - Modern, lightweight audio streaming
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ♿ **Accessibility** - Screen reader friendly with ARIA labels
- ⌨️ **Keyboard Shortcuts** - Spacebar to play/pause
- 🎨 **Animated Logo** - Eye-catching logo animation
- 📊 **Track Information** - Real-time track updates from stream
- 🔗 **Discogs Integration** - Direct links to track information
- 📱 **PWA Ready** - Progressive Web App support

## Technical Stack

- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with animations and responsive design
- **Vanilla JavaScript** - Lightweight, no heavy dependencies
- **HTML5 Audio API** - Native browser audio support
- **Bootstrap 4** - Responsive grid system
- **Font Awesome** - Icon library

## File Structure

```
realbadradio.com/
├── index.html              # Main HTML file
├── css/
│   └── style.min.css       # Stylesheet
├── js/
│   ├── audio-player.js     # HTML5 audio player
│   ├── radiotitle.js       # Track information updates
│   └── jquery.min.js       # jQuery (fallback)
├── img/                    # Images and icons
├── manifest.json           # PWA manifest
└── README.md              # This file
```

## Recent Improvements

### Replaced jQuery jPlayer with HTML5 Audio API
- **Removed**: `jquery.jplayer.min.js` and `jquery.jplayer.swf` (60KB+ saved)
- **Added**: Modern `audio-player.js` with better error handling
- **Benefits**: 
  - Smaller file size
  - Better performance
  - Modern browser support
  - No Flash dependencies

### Enhanced Features
- **Error Handling**: User-friendly error messages
- **Keyboard Support**: Spacebar play/pause
- **Better UX**: Smooth transitions and hover effects
- **Accessibility**: ARIA labels and focus management
- **Mobile Optimization**: Improved responsive design

## Usage

1. **Play/Pause**: Click the Play/Pause button or press Spacebar
2. **External Player**: Click the VLC icon to open in external player
3. **Track Info**: Click the music icon to view track on Discogs
4. **Contact**: Click the envelope icon to send an email

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

The site uses a simple, static setup. To modify:

1. Edit `index.html` for structure changes
2. Modify `css/style.min.css` for styling
3. Update `js/audio-player.js` for player functionality
4. Edit `js/radiotitle.js` for track information logic

## License

This project is for Real Bad Radio. All rights reserved. 