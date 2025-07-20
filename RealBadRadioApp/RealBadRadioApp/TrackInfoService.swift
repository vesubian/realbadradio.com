import Foundation
import Combine

class TrackInfoService: ObservableObject {
    @Published var currentTrack: TrackInfo?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var timer: Timer?
    private let trackInfoURL = "https://stream.realbadradio.com/title.js"
    
    init() {
        startPolling()
    }
    
    deinit {
        stopPolling()
    }
    
    func startPolling() {
        // Initial fetch
        fetchTrackInfo()
        
        // Set up timer to poll every 5 seconds
        timer = Timer.scheduledTimer(withTimeInterval: 5.0, repeats: true) { [weak self] _ in
            self?.fetchTrackInfo()
        }
    }
    
    func stopPolling() {
        timer?.invalidate()
        timer = nil
    }
    
    private func fetchTrackInfo() {
        guard let url = URL(string: trackInfoURL) else {
            errorMessage = "Invalid URL"
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        var request = URLRequest(url: url)
        request.timeoutInterval = 10.0
        
        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            DispatchQueue.main.async {
                self?.isLoading = false
                
                if let error = error {
                    self?.errorMessage = "Network error: \(error.localizedDescription)"
                    return
                }
                
                guard let data = data else {
                    self?.errorMessage = "No data received"
                    return
                }
                
                // The API returns JSONP, so we need to extract the JSON part
                if let jsonString = String(data: data, encoding: .utf8) {
                    self?.parseJSONP(jsonString)
                }
            }
        }.resume()
    }
    
    private func parseJSONP(_ jsonpString: String) {
        // Remove the JSONP wrapper (parseMusic(...))
        let startIndex = jsonpString.firstIndex(of: "(")
        let endIndex = jsonpString.lastIndex(of: ")")
        
        guard let start = startIndex, let end = endIndex, start < end else {
            errorMessage = "Invalid JSONP format"
            return
        }
        
        let jsonStart = jsonpString.index(after: start)
        let jsonEnd = jsonpString.index(before: end)
        let jsonString = String(jsonpString[jsonStart...jsonEnd])
        
        guard let jsonData = jsonString.data(using: .utf8) else {
            errorMessage = "Failed to convert JSON string to data"
            return
        }
        
        do {
            let trackInfo = try JSONDecoder().decode(TrackInfo.self, from: jsonData)
            currentTrack = trackInfo
        } catch {
            errorMessage = "Failed to parse track info: \(error.localizedDescription)"
        }
    }
    
    func refreshTrackInfo() {
        fetchTrackInfo()
    }
} 