import { Market, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { marketSchema } from "./spotify/schema";
import { z } from "zod";

const lynkifyResponseSchema = z.object({
  songType: z.string(),
  songName: z.string(),
  songId: z.string(),
});

function parseLynkifyResponse(rawResponseBody: string) {
  const rawJson = rawResponseBody.split("\n")[1].slice(2);
  const json = JSON.parse(rawJson);
  return lynkifyResponseSchema.parse(json);
}

export async function fetchLynkifyUrl(musicProviderUrl: string) {
  const res = await fetch("https://lynkify.in/create-link", {
    body: JSON.stringify([musicProviderUrl]),
    method: "POST",
    headers: {
      "next-action": "b40862cfb950af1504cc8b997391f8c65d627b2c",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch lynkify url", {
      cause: res,
    });
  }

  if (res.headers.get("content-type") !== "text/x-component") {
    throw new Error("Unexpected content type from Lynkify", {
      cause: res,
    });
  }

  const { songType, songName, songId } = await res
    .text()
    .then(parseLynkifyResponse)
    .catch((e) => {
      throw new Error("Failed to parse Lynkify response", {
        cause: e,
      });
    });

  const url = `https://lynkify.in/${songType}/${songName}/${songId}`;
  return url;
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
