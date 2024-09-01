import { Market, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { marketSchema } from "../spotify/schema";

import {
  createLynkifyUrlFetcher,
  findValidNextActionIdWhileFetchingUrl,
} from "./fetcher";
import { Repository } from "../types";

export { createHonoNextActionIdRepo } from "./utils";

/**
 * Fetch Lynkify URL
 * @param musicProviderUrl
 * @returns
 */
export async function fetchLynkifyUrl(
  musicProviderUrl: string,
  nextActionIdRepo: Repository<string>
) {
  const nextActionId = await nextActionIdRepo.get();

  // If nextActionId is not set, find a valid one
  if (!nextActionId) {
    return await findValidNextActionIdWhileFetchingUrl(
      musicProviderUrl,
      nextActionIdRepo
    );
  }

  try {
    const fetchLynkifyUrl = createLynkifyUrlFetcher(nextActionId);
    return await fetchLynkifyUrl(musicProviderUrl);
  } catch {
    return await findValidNextActionIdWhileFetchingUrl(
      musicProviderUrl,
      nextActionIdRepo
    );
  }
}

/**
 * Fetch Spotify track ID from Lynkify URL
 * @param lynkifyUrl
 * @returns
 */
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

/**
 * Fetch Spotify track
 * @param client
 * @param spotifyId
 * @param market
 * @returns
 */
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
