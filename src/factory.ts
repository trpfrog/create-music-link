import { RateLimitBinding } from "@hono-rate-limiter/cloudflare";
import { createFactory } from "hono/factory";

export type AppType = {
  Variables: {
    rateLimit: boolean;
  };
  Bindings: {
    RATE_LIMITER: RateLimitBinding;
    KV: KVNamespace<"current-next-action">;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_CLIENT_SECRET: string;
  };
};

export const factory = createFactory<AppType>();
