import { describe, it, expect } from "vitest";
import { generateNowPlaygroundTweet } from "./tweet";
import {
  createSimplifiedAlbumMock,
  createArtistMock,
  createTrackMock,
} from "../mock/spotifyMocks";
import type { Track } from "@spotify/web-api-ts-sdk";

describe("generateNowPlaygroundTweet", () => {
  const lynkifyUrl = "https://example.com/track";

  const baseTrack = createTrackMock({
    name: "Track Name",
    artists: [createArtistMock({ name: "Artist One" })],
    album: createSimplifiedAlbumMock({
      name: "Album Name",
      artists: [createArtistMock({ name: "Album Artist One" })],
    }),
  });

  const testCases: {
    description: string;
    track: Track;
    options?: { template?: string };
    expected: string;
  }[] = [
    {
      description:
        "generates a tweet with default template including albumInfo when required",
      track: baseTrack,
      options: undefined,
      expected:
        "#nowplaying Artist One - Track Name (Album Artist One - Album Name)\nhttps://example.com/track",
    },
    {
      description: "excludes albumInfo when artists are the same",
      track: createTrackMock({
        ...baseTrack,
        artists: baseTrack.album.artists,
      }),
      options: undefined,
      expected:
        "#nowplaying Album Artist One - Track Name\nhttps://example.com/track",
    },
    {
      description:
        "excludes albumInfo when track name is the same as album name",
      track: createTrackMock({
        ...baseTrack,
        name: "Album Name",
        artists: baseTrack.artists,
      }),
      options: undefined,
      expected:
        "#nowplaying Artist One - Album Name\nhttps://example.com/track",
    },
    {
      description: "formats the track duration correctly",
      track: createTrackMock({
        ...baseTrack,
        duration_ms: 123456, // 2 minutes and 3 seconds
      }),
      options: {
        template:
          "#nowplaying ${artists} - ${trackName} (${minutes}:${seconds}) ${url}",
      },
      expected:
        "#nowplaying Artist One - Track Name (2:03) https://example.com/track",
    },
    {
      description: "supports custom templates",
      track: baseTrack,
      options: {
        template:
          "Listening to ${trackName} by ${artists} on ${albumArtists} - ${albumName}. Link: ${url}",
      },
      expected:
        "Listening to Track Name by Artist One on Album Artist One - Album Name. Link: https://example.com/track",
    },
    {
      description: "handles a single artist correctly",
      track: createTrackMock({
        ...baseTrack,
        artists: [createArtistMock({ name: "Solo Artist" })],
        album: {
          ...baseTrack.album,
          artists: [createArtistMock({ name: "Solo Artist" })],
        },
      }),
      options: undefined,
      expected:
        "#nowplaying Solo Artist - Track Name\nhttps://example.com/track",
    },
    {
      description: "handles empty albumInfo gracefully",
      track: createTrackMock({
        ...baseTrack,
        artists: baseTrack.album.artists,
        album: {
          ...baseTrack.album,
          name: baseTrack.name,
        },
      }),
      options: undefined,
      expected:
        "#nowplaying Album Artist One - Track Name\nhttps://example.com/track",
    },
    {
      description: "joins multiple artists with the correct conjunction",
      track: createTrackMock({
        ...baseTrack,
        artists: [
          createArtistMock({ name: "Artist One" }),
          createArtistMock({ name: "Artist Two" }),
          createArtistMock({ name: "Artist Three" }),
        ],
      }),
      options: undefined,
      expected:
        "#nowplaying Artist One, Artist Two & Artist Three - Track Name (Album Artist One - Album Name)\nhttps://example.com/track",
    },
  ];

  testCases.forEach(({ description, track, options, expected }) => {
    it(description, () => {
      const tweet = generateNowPlaygroundTweet(track, lynkifyUrl, options);
      expect(tweet).toBe(expected);
    });
  });
});
