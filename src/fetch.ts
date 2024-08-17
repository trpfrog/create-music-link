import { Market, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { marketSchema } from "./spotify/schema";

export async function fetchLynkifyUrl(musicProviderUrl: string) {
  const url = new URL("https://lynkify.in/create");
  url.searchParams.append("url", musicProviderUrl);
  const res = await fetch(url);
  if (res.ok) {
    return res.url;
  } else {
    throw new Error("Failed to fetch lynkify url", {
      cause: res,
    });
  }
}

export async function fetchSpotifyTrackIdFromLykinfyUrl(lynkifyUrl: string) {
  const res = await fetch(lynkifyUrl);
  const text = await res.text();

  const match = text.match(/open.spotify.com\/track\/(\w+)/);
  if (match) {
    return match[1];
  } else {
    throw new Error(
      `Failed to extract Spotify track ID from Lynkify site\n(${lynkifyUrl})`
    );
  }
}

export async function fetchSpotifyTrack(
  client: { id: string; secret: string },
  spotifyId: string,
  market?: Market | (string & {})
): Promise<Track> {
  const validatedMarket = marketSchema
    .optional()
    .catch(undefined)
    .parse(market);
  const sdk = SpotifyApi.withClientCredentials(client.id, client.secret);
  const track = await sdk.tracks.get(spotifyId, validatedMarket);
  return track;
}
