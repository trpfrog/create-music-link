import { z } from "zod";

const lynkifyResponseSchema = z.object({
  songType: z.string(),
  songName: z.string(),
  songId: z.string(),
});

export function parseLynkifyResponse(rawResponseBody: string) {
  const rawJson = rawResponseBody.split("\n")[1].slice(2);
  const json = JSON.parse(rawJson);
  return lynkifyResponseSchema.parse(json);
}

export function createServerActionsFetcher(to: {
  url: string;
  nextAction: string;
}) {
  return async (...args: unknown[]) =>
    await fetch(to.url, {
      method: "POST",
      headers: {
        "next-action": to.nextAction,
      },
      body: JSON.stringify(args),
    });
}
