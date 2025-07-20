import Foundation
import AVFoundation
import Combine

class AudioPlayer: ObservableObject {
    @Published var isPlaying = false
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var player: AVPlayer?
    private var playerItem: AVPlayerItem?
    private var timeObserver: Any?
    private let streamURL = "https://stream.realbadradio.com/mpd.mp3"
    
    init() {
        setupPlayer()
        setupNotifications()
    }
    
    deinit {
        cleanup()
    }
    
    private func setupPlayer() {
        guard let url = URL(string: streamURL) else {
            errorMessage = "Invalid stream URL"
            return
        }
        
        playerItem = AVPlayerItem(url: url)
        player = AVPlayer(playerItem: playerItem)
        
        // Add observer for player item status
        playerItem?.addObserver(self, forKeyPath: "status", options: [.new, .old], context: nil)
        
        // Add observer for playback status
        player?.addObserver(self, forKeyPath: "timeControlStatus", options: [.new, .old], context: nil)
    }
    
    private func setupNotifications() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(playerItemDidReachEnd),
            name: .AVPlayerItemDidPlayToEndTime,
            object: playerItem
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleInterruption),
            name: AVAudioSession.interruptionNotification,
            object: nil
        )
    }
    
    func play() {
        guard let player = player else {
            errorMessage = "Player not initialized"
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        player.play()
    }
    
    func pause() {
        guard let player = player else { return }
        
        player.pause()
        isPlaying = false
        isLoading = false
    }
    
    func stop() {
        guard let player = player else { return }
        
        player.pause()
        player.seek(to: .zero)
        isPlaying = false
        isLoading = false
    }
    
    private func cleanup() {
        if let timeObserver = timeObserver {
            player?.removeTimeObserver(timeObserver)
        }
        
        playerItem?.removeObserver(self, forKeyPath: "status")
        player?.removeObserver(self, forKeyPath: "timeControlStatus")
        
        NotificationCenter.default.removeObserver(self)
        
        player = nil
        playerItem = nil
    }
    
    @objc private func playerItemDidReachEnd() {
        DispatchQueue.main.async {
            self.isPlaying = false
            self.isLoading = false
        }
    }
    
    @objc private func handleInterruption(notification: Notification) {
        guard let userInfo = notification.userInfo,
              let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: typeValue) else {
            return
        }
        
        switch type {
        case .began:
            // Interruption began, pause playback
            pause()
        case .ended:
            // Interruption ended, resume if appropriate
            if let optionsValue = userInfo[AVAudioSessionInterruptionOptionKey] as? UInt {
                let options = AVAudioSession.InterruptionOptions(rawValue: optionsValue)
                if options.contains(.shouldResume) {
                    play()
                }
            }
        @unknown default:
            break
        }
    }
    
    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        DispatchQueue.main.async {
            if keyPath == "status" {
                if let playerItem = object as? AVPlayerItem {
                    switch playerItem.status {
                    case .readyToPlay:
                        self.isLoading = false
                        self.errorMessage = nil
                    case .failed:
                        self.isLoading = false
                        self.errorMessage = "Failed to load stream: \(playerItem.error?.localizedDescription ?? "Unknown error")"
                    case .unknown:
                        self.isLoading = true
                    @unknown default:
                        break
                    }
                }
            } else if keyPath == "timeControlStatus" {
                if let player = object as? AVPlayer {
                    switch player.timeControlStatus {
                    case .playing:
                        self.isPlaying = true
                        self.isLoading = false
                    case .paused:
                        self.isPlaying = false
                        self.isLoading = false
                    case .waitingToPlayAtSpecifiedRate:
                        self.isLoading = true
                    @unknown default:
                        break
                    }
                }
            }
        }
    }
} 