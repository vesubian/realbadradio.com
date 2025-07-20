import SwiftUI

struct TrackInfoView: View {
    @ObservedObject var trackInfoService: TrackInfoService
    
    var body: some View {
        VStack(spacing: 16) {
            if trackInfoService.isLoading {
                HStack {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .scaleEffect(0.7)
                    Text("Loading track info...")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            } else if let track = trackInfoService.currentTrack {
                VStack(alignment: .leading, spacing: 12) {
                    // Track title
                    Text(track.displayTitle)
                        .font(.headline)
                        .foregroundColor(.primary)
                        .multilineTextAlignment(.leading)
                    
                    // Additional track info if available
                    if let album = track.album, !album.isEmpty {
                        Text(album)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    
                    if let label = track.label, !label.isEmpty {
                        Text(label)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .italic()
                    }
                    
                    if let year = track.year, !year.isEmpty {
                        Text(year)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    // Action buttons
                    HStack(spacing: 12) {
                        if let discogsURL = track.discogsSearchURL {
                            Link(destination: discogsURL) {
                                HStack(spacing: 4) {
                                    Image(systemName: "music.note")
                                        .font(.caption)
                                    Text("Discogs")
                                        .font(.caption)
                                }
                                .foregroundColor(.orange)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.orange.opacity(0.1))
                                .cornerRadius(4)
                            }
                        }
                        
                        if let lastfmURL = track.lastfmSearchURL {
                            Link(destination: lastfmURL) {
                                HStack(spacing: 4) {
                                    Image(systemName: "music.mic")
                                        .font(.caption)
                                    Text("Last.fm")
                                        .font(.caption)
                                }
                                .foregroundColor(.red)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.red.opacity(0.1))
                                .cornerRadius(4)
                            }
                        }
                    }
                }
                .padding()
                .background(Color(.systemBackground))
                .cornerRadius(8)
                .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
            } else if let errorMessage = trackInfoService.errorMessage {
                VStack {
                    Image(systemName: "exclamationmark.triangle")
                        .foregroundColor(.orange)
                        .font(.title2)
                    Text("Track info unavailable")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(errorMessage)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding()
            } else {
                Text("No track information available")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding(.horizontal)
    }
}

struct TrackInfoView_Previews: PreviewProvider {
    static var previews: some View {
        TrackInfoView(trackInfoService: TrackInfoService())
            .padding()
    }
} 