import { Context } from "hono";
import { z } from "zod";
import { AppType } from "../factory";
import { Repository } from "../types";

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
