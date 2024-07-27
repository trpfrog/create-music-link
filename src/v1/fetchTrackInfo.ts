import { Context } from "hono";
import { AppType } from "../factory";
import { HTTPException } from "hono/http-exception";
import {
  fetchLynkifyUrl,
  fetchSpotifyTrack,
  fetchSpotifyTrackIdFromLykinfyUrl,
} from "../fetch";

export async function fetchTrackInfo(c: Context<AppType>, reqUrl: string) {
  const lynkifyUrl = await fetchLynkifyUrl(reqUrl).catch(() => {
    throw new HTTPException(500, { message: "Failed to fetch lynkify url" });
  });

  const spotifyId = await fetchSpotifyTrackIdFromLykinfyUrl(lynkifyUrl).catch(
    () => {
      throw new HTTPException(500, {
        message: `Failed to extract Spotify track ID from Lynkify site\n(${lynkifyUrl})`,
      });
    }
  );

  const spotifyClient = {
    id: c.env.SPOTIFY_CLIENT_ID,
    secret: c.env.SPOTIFY_CLIENT_SECRET,
  };
  const track = await fetchSpotifyTrack(spotifyClient, spotifyId, "JP").catch(
    (e) => {
      throw new HTTPException(500, {
        message: `Failed to fetch Spotify track (Spotify id: ${spotifyId})`,
      });
    }
  );

  return { track, lynkifyUrl };
}
