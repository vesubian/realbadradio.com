import SwiftUI

struct PlayerView: View {
    @ObservedObject var audioPlayer: AudioPlayer
    
    var body: some View {
        VStack(spacing: 20) {
            // Play/Pause Button
            Button(action: {
                if audioPlayer.isPlaying {
                    audioPlayer.pause()
                } else {
                    audioPlayer.play()
                }
            }) {
                HStack(spacing: 8) {
                    Image(systemName: audioPlayer.isPlaying ? "pause.fill" : "play.fill")
                        .font(.title2)
                    Text(audioPlayer.isPlaying ? "Pause" : "Play")
                        .font(.headline)
                }
                .foregroundColor(audioPlayer.isPlaying ? .white : .black)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 0)
                        .fill(audioPlayer.isPlaying ? Color.black : Color.clear)
                        .overlay(
                            RoundedRectangle(cornerRadius: 0)
                                .stroke(Color.black, lineWidth: 2)
                        )
                )
            }
            .disabled(audioPlayer.isLoading)
            .scaleEffect(audioPlayer.isLoading ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.2), value: audioPlayer.isLoading)
            
            // Loading indicator
            if audioPlayer.isLoading {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle())
                    .scaleEffect(0.8)
            }
            
            // Error message
            if let errorMessage = audioPlayer.errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .font(.caption)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }
        }
        .padding()
    }
}

struct PlayerView_Previews: PreviewProvider {
    static var previews: some View {
        PlayerView(audioPlayer: AudioPlayer())
            .padding()
    }
} 