import Foundation

struct TrackInfo: Codable, Identifiable {
    let id = UUID()
    let title: String
    let artist: String?
    let album: String?
    let year: String?
    let label: String?
    let artworkURL: String?
    
    enum CodingKeys: String, CodingKey {
        case title
        case artist
        case album
        case year
        case label
        case artworkURL = "artwork_url"
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        title = try container.decode(String.self, forKey: .title)
        artist = try container.decodeIfPresent(String.self, forKey: .artist)
        album = try container.decodeIfPresent(String.self, forKey: .album)
        year = try container.decodeIfPresent(String.self, forKey: .year)
        label = try container.decodeIfPresent(String.self, forKey: .label)
        artworkURL = try container.decodeIfPresent(String.self, forKey: .artworkURL)
    }
    
    init(title: String, artist: String? = nil, album: String? = nil, year: String? = nil, label: String? = nil, artworkURL: String? = nil) {
        self.title = title
        self.artist = artist
        self.album = album
        self.year = year
        self.label = label
        self.artworkURL = artworkURL
    }
    
    var displayTitle: String {
        if let artist = artist, !artist.isEmpty {
            return "\(artist) - \(title)"
        }
        return title
    }
    
    var discogsSearchURL: URL? {
        let cleanTitle = title.replacingOccurrences(of: #" *\([^)]*\) *"#, with: "", options: .regularExpression).trimmingCharacters(in: .whitespacesAndNewlines)
        let searchQuery = artist != nil ? "\(artist!) \(cleanTitle)" : cleanTitle
        let encodedQuery = searchQuery.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        return URL(string: "https://www.discogs.com/search/?q=\(encodedQuery)")
    }
    
    var lastfmSearchURL: URL? {
        let cleanTitle = title.replacingOccurrences(of: #" *\([^)]*\) *"#, with: "", options: .regularExpression).trimmingCharacters(in: .whitespacesAndNewlines)
        let searchQuery = artist != nil ? "\(artist!) \(cleanTitle)" : cleanTitle
        let encodedQuery = searchQuery.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        return URL(string: "https://www.last.fm/search?q=\(encodedQuery)")
    }
} 