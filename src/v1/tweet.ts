import { Track } from "@spotify/web-api-ts-sdk";

export function generateNowPlaygroundTweet(track: Track, lynkifyUrl: string) {
  const artists = track.artists.map((a) => a.name).join(" & ");
  const albumArtists = track.album.artists.map((a) => a.name).join(" & ");
  const tweet = [
    `#nowplaying ${artists} - ${track.name} (${albumArtists} - ${track.album.name})`,
    lynkifyUrl,
  ].join("\n");

  return tweet;
}

export function createNowPlaygroundTweetUrl(track: Track, lynkifyUrl: string) {
  const tweet = generateNowPlaygroundTweet(track, lynkifyUrl);
  return `https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
}
