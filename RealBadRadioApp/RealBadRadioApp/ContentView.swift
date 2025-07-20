import SwiftUI

struct ContentView: View {
    @StateObject private var audioPlayer = AudioPlayer()
    @StateObject private var trackInfoService = TrackInfoService()
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 30) {
                    // Logo
                    LogoView()
                        .padding(.top, 20)
                    
                    // Player Controls
                    PlayerView(audioPlayer: audioPlayer)
                    
                    // Track Information
                    TrackInfoView(trackInfoService: trackInfoService)
                    
                    // Footer Links
                    VStack(spacing: 16) {
                        // External player link
                        Link(destination: URL(string: "https://stream.realbadradio.com/mpd.mp3.m3u")!) {
                            HStack(spacing: 8) {
                                Image(systemName: "externaldrive")
                                    .font(.caption)
                                Text("Open in External Player")
                                    .font(.caption)
                            }
                            .foregroundColor(.secondary)
                        }
                        
                        // Contact email
                        Link(destination: URL(string: "mailto:contact@realbadradio.com")!) {
                            HStack(spacing: 8) {
                                Image(systemName: "envelope")
                                    .font(.caption)
                                Text("Contact Us")
                                    .font(.caption)
                            }
                            .foregroundColor(.secondary)
                        }
                        
                        // Lamixtape link
                        Link(destination: URL(string: "https://lamixtape.fr")!) {
                            HStack(spacing: 8) {
                                Image(systemName: "music.note.list")
                                    .font(.caption)
                                Text("Lamixtape")
                                    .font(.caption)
                            }
                            .foregroundColor(.secondary)
                        }
                    }
                    .padding(.top, 20)
                    
                    Spacer(minLength: 50)
                }
                .padding(.horizontal)
            }
            .navigationTitle("Real Bad Radio")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        trackInfoService.refreshTrackInfo()
                    }) {
                        Image(systemName: "arrow.clockwise")
                    }
                }
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
} 