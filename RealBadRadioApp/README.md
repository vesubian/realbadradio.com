# Real Bad Radio iOS App

A native iOS app for streaming Real Bad Radio, built with SwiftUI and AVFoundation.

## Features

- 🎵 **Live Radio Streaming** - Stream Real Bad Radio directly from the official stream
- 📱 **Native iOS Experience** - Built with SwiftUI for a smooth, native feel
- 🎨 **Animated Logo** - Recreates the website's logo animation
- 📊 **Real-time Track Info** - Displays current track information with automatic updates
- 🔗 **Music Discovery** - Direct links to Discogs and Last.fm for track information
- 🎧 **Background Audio** - Continues playing when app is in background
- 📧 **Contact Integration** - Direct email and external player links

## Requirements

- iOS 17.0 or later
- Xcode 15.0 or later
- macOS 14.0 or later (for development)

## Installation & Testing

### Option 1: Open in Xcode (Recommended)

1. **Open the project in Xcode:**
   ```bash
   cd RealBadRadioApp
   open RealBadRadioApp.xcodeproj
   ```

2. **Select a target device:**
   - Choose your iPhone/iPad from the device selector
   - Or use the iOS Simulator

3. **Build and run:**
   - Press `Cmd + R` or click the "Play" button
   - The app will build and launch on your device/simulator

### Option 2: Command Line Build

1. **Navigate to the project directory:**
   ```bash
   cd RealBadRadioApp
   ```

2. **Build for simulator:**
   ```bash
   xcodebuild -project RealBadRadioApp.xcodeproj -scheme RealBadRadioApp -destination 'platform=iOS Simulator,name=iPhone 15' build
   ```

3. **Build for device (requires signing):**
   ```bash
   xcodebuild -project RealBadRadioApp.xcodeproj -scheme RealBadRadioApp -destination 'platform=iOS,id=YOUR_DEVICE_ID' build
   ```

## Testing the App

### Basic Functionality Test

1. **Launch the app** - You should see the Real Bad Radio logo with animation
2. **Tap Play** - The stream should start playing
3. **Check track info** - Current track information should appear below the player
4. **Test pause/resume** - Tap pause, then play again
5. **Background audio** - Put app in background, audio should continue

### Advanced Testing

1. **Network interruption** - Turn off WiFi/cellular, then reconnect
2. **Audio interruptions** - Receive a phone call, then return to app
3. **Track info updates** - Wait for track changes (updates every 5 seconds)
4. **External links** - Tap Discogs/Last.fm links to verify they open
5. **Contact links** - Test email and external player links

### Simulator vs Device Testing

**iOS Simulator:**
- ✅ Basic UI testing
- ✅ Navigation testing
- ❌ Audio streaming (limited)
- ❌ Background audio
- ❌ Audio interruptions

**Physical Device:**
- ✅ Full audio functionality
- ✅ Background audio
- ✅ Audio interruptions
- ✅ Network conditions
- ✅ Real performance testing

## Project Structure

```
RealBadRadioApp/
├── RealBadRadioApp/
│   ├── RealBadRadioAppApp.swift      # App entry point
│   ├── ContentView.swift             # Main view
│   ├── AudioPlayer.swift             # Audio streaming logic
│   ├── TrackInfoService.swift        # Track info API
│   ├── TrackInfo.swift               # Data model
│   ├── PlayerView.swift              # Player controls
│   ├── TrackInfoView.swift           # Track display
│   ├── LogoView.swift                # Animated logo
│   └── Assets.xcassets/              # Images and icons
├── RealBadRadioApp.xcodeproj/        # Xcode project
└── README.md                         # This file
```

## Key Components

### AudioPlayer
- Handles streaming audio using AVFoundation
- Manages play/pause states
- Handles audio interruptions (calls, etc.)
- Background audio support

### TrackInfoService
- Fetches current track information from the radio API
- Polls for updates every 5 seconds
- Parses JSONP responses
- Error handling and retry logic

### UI Components
- **LogoView**: Animated logo similar to website
- **PlayerView**: Play/pause controls with loading states
- **TrackInfoView**: Displays track info with external links
- **ContentView**: Main layout and navigation

## Troubleshooting

### Common Issues

1. **Build errors:**
   - Ensure Xcode 15.0+ is installed
   - Clean build folder: `Cmd + Shift + K`
   - Reset package caches: `File > Packages > Reset Package Caches`

2. **Audio not playing:**
   - Check device volume
   - Verify internet connection
   - Check audio session permissions
   - Test on physical device (simulator has limited audio)

3. **Track info not loading:**
   - Check network connection
   - Verify API endpoint is accessible
   - Check console for error messages

4. **App crashes:**
   - Check device logs in Xcode console
   - Verify all required permissions are granted
   - Test on different iOS versions

### Debug Information

Enable debug logging by adding this to any Swift file:
```swift
#if DEBUG
print("Debug: \(message)")
#endif
```

## API Endpoints

- **Stream URL**: `https://stream.realbadradio.com/mpd.mp3`
- **Track Info**: `https://stream.realbadradio.com/title.js`
- **External Player**: `https://stream.realbadradio.com/mpd.mp3.m3u`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Real Bad Radio content and branding belong to their respective owners.

## Support

For issues with the radio stream or content, contact: contact@realbadradio.com

For app development issues, check the troubleshooting section above or create an issue in the repository. 