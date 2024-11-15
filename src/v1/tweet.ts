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
    "#nowplaying ${artists} - ${trackName} ${albumInfo}\n${url}";

  const artists = joinWithAnd(track.artists.map((a) => a.name));
  const albumArtists = joinWithAnd(track.album.artists.map((a) => a.name));
  const albumInfo = `(${albumArtists} - ${track.album.name})`;

  const isAlbumInfoRequired =
    artists.toLowerCase() !== albumArtists.toLowerCase() &&
    track.album.name.toLowerCase() !== track.name.toLowerCase();

  const filled = fillTemplate(template, {
    artists,
    albumArtists,
    trackName: track.name,
    albumName: track.album.name,
    minutes: Math.floor(track.duration_ms / 1000 / 60),
    seconds: Math.floor((track.duration_ms / 1000) % 60)
      .toString()
      .padStart(2, "0"),
    url: lynkifyUrl,
    albumInfo: isAlbumInfoRequired ? albumInfo : "",
  });

  // Remove trailing whitespaces
  return filled
    .split("\n")
    .map((e) => e.trimEnd())
    .join("\n");
}

export function createNowPlaygroundTweetUrl(track: Track, lynkifyUrl: string) {
  const tweet = generateNowPlaygroundTweet(track, lynkifyUrl);
  return `https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
}
