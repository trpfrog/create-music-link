import { Market, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { marketSchema } from "../spotify/schema";
import { Context } from "hono";

import {
  createLynkifyUrlFetcher,
  fetchAllNextActionIdsInLynkify,
} from "./fetcher";
import type { AppType } from "../factory";
import { Repository } from "../types";

export function createHonoNextActionIdRepo(
  c: Context<AppType>
): Repository<string> {
  return {
    get: async () => {
      const value = await c.env.KV.get("current-next-action");
      return value;
    },
    set: async (value: string) => {
      await c.env.KV.put("current-next-action", value);
    },
  };
}

/**
 * Find a valid nextActionId while fetching the Lynkify URL.
 * @param musicProviderUrl
 * @returns
 */
async function findValidNextActionIdWhileFetchingUrl(
  musicProviderUrl: string,
  nextActionIdRepo: Repository<string>
) {
  console.log("Find valid nextActionId");
  // Fetch nextActionId candidates and filter out failed ones
  const nextActionIdCandidates = await fetchAllNextActionIdsInLynkify();

  console.log(
    `Found ${nextActionIdCandidates.length} candidates: ${nextActionIdCandidates}`
  );
  for (const nextActionId of nextActionIdCandidates) {
    // Update nextActionId to the candidate
    console.log(`Trying nextActionId: ${nextActionId}`);
    const fetchLynkifyUrl = createLynkifyUrlFetcher(nextActionId);

    try {
      // Try fetching the Lynkify URL with the candidate nextActionId
      const url = await fetchLynkifyUrl(musicProviderUrl);
      // if no error is thrown, the nextActionId is valid
      await nextActionIdRepo.set(nextActionId);
      console.log(`nextActionId ${nextActionId} is valid`);
      return url;
    } catch (e) {
      console.error(e);
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
