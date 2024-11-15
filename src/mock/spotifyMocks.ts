import type {
  SimplifiedTrack,
  Track,
  SimplifiedArtist,
  Artist,
  SimplifiedAlbum,
  Album,
} from "@spotify/web-api-ts-sdk";

// Helper function for generating unique IDs
const generateId = (() => {
  let counter = 0;
  return () => `mock-id-${counter++}`;
})();

// Factory for SimplifiedArtist
export const createSimplifiedArtistMock = (
  overrides: Partial<SimplifiedArtist> = {}
): SimplifiedArtist => ({
  external_urls: { spotify: "https://spotify.com/artist/" + generateId() },
  href: "https://api.spotify.com/v1/artists/" + generateId(),
  id: generateId(),
  name: "Sample Artist",
  type: "artist",
  uri: "spotify:artist:" + generateId(),
  ...overrides,
});

// Factory for Artist
export const createArtistMock = (overrides: Partial<Artist> = {}): Artist => ({
  ...createSimplifiedArtistMock(),
  followers: { total: 1000, href: null },
  genres: ["pop", "rock"],
  images: [{ url: "https://via.placeholder.com/300", height: 300, width: 300 }],
  popularity: 80,
  ...overrides,
});

// Factory for SimplifiedAlbum
export const createSimplifiedAlbumMock = (
  overrides: Partial<SimplifiedAlbum> = {}
): SimplifiedAlbum => ({
  album_type: "album",
  available_markets: ["US", "JP", "GB"],
  copyrights: [{ text: "© 2024 Sample Label", type: "C" }],
  external_ids: {
    upc: "123456789012",
    ean: "1234567890123",
    isrc: "US-S1Z-99-00001",
  },
  external_urls: { spotify: "https://spotify.com/album/" + generateId() },
  genres: ["pop"],
  href: "https://api.spotify.com/v1/albums/" + generateId(),
  id: generateId(),
  images: [{ url: "https://via.placeholder.com/300", height: 300, width: 300 }],
  label: "Sample Label",
  name: "Sample Album",
  popularity: 75,
  release_date: "2024-01-01",
  release_date_precision: "day",
  total_tracks: 10,
  type: "album",
  uri: "spotify:album:" + generateId(),
  album_group: "album",
  artists: [createSimplifiedArtistMock()],
  ...overrides,
});

// Factory for Album
export const createAlbumMock = (overrides: Partial<Album> = {}): Album => ({
  ...createSimplifiedAlbumMock(),
  artists: [createArtistMock()],
  tracks: {
    href: "https://api.spotify.com/v1/albums/" + generateId() + "/tracks",
    items: [createSimplifiedTrackMock()],
    limit: 10,
    next: null,
    offset: 0,
    previous: null,
    total: 10,
  },
  ...overrides,
});

// Factory for SimplifiedTrack
const createSimplifiedTrackMock = (
  overrides: Partial<SimplifiedTrack> = {}
): SimplifiedTrack => ({
  artists: [createSimplifiedArtistMock()],
  available_markets: ["US", "JP", "GB"],
  disc_number: 1,
  duration_ms: 180000,
  episode: false,
  explicit: false,
  external_urls: { spotify: "https://spotify.com/track/" + generateId() },
  href: "https://api.spotify.com/v1/tracks/" + generateId(),
  id: generateId(),
  is_local: false,
  name: "Sample Track",
  preview_url: "https://p.scdn.co/mp3-preview/" + generateId(),
  track: true,
  track_number: 1,
  type: "track",
  uri: "spotify:track:" + generateId(),
  ...overrides,
});

// Factory for Track
export const createTrackMock = (overrides: Partial<Track> = {}): Track => ({
  ...createSimplifiedTrackMock(),
  album: createSimplifiedAlbumMock(),
  external_ids: {
    isrc: "US-S1Z-99-00001",
    ean: "1234567890123",
    upc: "123456789012",
  },
  popularity: 85,
  ...overrides,
});
