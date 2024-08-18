import { Track } from "@spotify/web-api-ts-sdk";
import { fillTemplate, joinWithAnd } from "../utils";

export function generateNowPlaygroundTweet(
  track: Track,
  lynkifyUrl: string,
  options?: {
    template?: string;
  }
) {
  const template =
    options?.template ||
    "#nowplaying ${artists} - ${trackName} (${albumArtists} - ${albumName})\n${url}";

  return fillTemplate(template, {
    artists: joinWithAnd(track.artists.map((a) => a.name)),
    albumArtists: joinWithAnd(track.album.artists.map((a) => a.name)),
    trackName: track.name,
    albumName: track.album.name,
    minutes: Math.floor(track.duration_ms / 1000 / 60),
    seconds: Math.floor((track.duration_ms / 1000) % 60),
    url: lynkifyUrl,
  });
}

export function createNowPlaygroundTweetUrl(track: Track, lynkifyUrl: string) {
  const tweet = generateNowPlaygroundTweet(track, lynkifyUrl);
  return `https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
}
