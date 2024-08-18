import { Market, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { marketSchema } from "../spotify/schema";

import {
  createLynkifyUrlFetcher,
  fetchAllNextActionIdsInLynkify,
} from "./fetcher";

let currentNextActionId = "";
const failedNextActionIds = new Set<string>();

/**
 * Find a valid nextActionId while fetching the Lynkify URL.
 * @param musicProviderUrl
 * @returns
 */
async function findValidNextActionIdWhileFetchingUrl(musicProviderUrl: string) {
  console.log("Find valid nextActionId");

  // Fetch nextActionId candidates and filter out failed ones
  const nextActionIdCandidates = await fetchAllNextActionIdsInLynkify().then(
    (candidates) => candidates.filter((c) => !failedNextActionIds.has(c))
  );

  for (const nextActionId of nextActionIdCandidates) {
    // Update nextActionId to the candidate
    console.log(`Trying nextActionId: ${nextActionId}`);
    const fetchLynkifyUrl = createLynkifyUrlFetcher(nextActionId);

    try {
      // Try fetching the Lynkify URL with the candidate nextActionId
      const url = await fetchLynkifyUrl(musicProviderUrl);
      // if no error is thrown, the nextActionId is valid
      currentNextActionId = nextActionId;
      console.log(`nextActionId ${nextActionId} is valid`);
      return url;
    } catch (e) {
      failedNextActionIds.add(nextActionId);
    }
  }

  // If no valid nextActionId is found, throw an error
  throw new Error("Failed to revalidate nextActionId");
}

/**
 * Fetch Lynkify URL
 * @param musicProviderUrl
 * @returns
 */
export async function fetchLynkifyUrl(musicProviderUrl: string) {
  const fetchLynkifyUrl = createLynkifyUrlFetcher(currentNextActionId);
  try {
    return await fetchLynkifyUrl(musicProviderUrl);
  } catch (e) {
    // Update nextActionId if return type is not text/x-component
    if (
      e instanceof Error &&
      e.cause instanceof Response &&
      e.cause.ok &&
      e.cause.headers.get("content-type") !== "text/x-component"
    ) {
      const url = await findValidNextActionIdWhileFetchingUrl(musicProviderUrl);
      return url;
    } else {
      throw e;
    }
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
