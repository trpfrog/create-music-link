import { RateLimitBinding } from "@hono-rate-limiter/cloudflare";
import { createFactory } from "hono/factory";

type AppType = {
  Variables: {
    rateLimit: boolean;
  };
  Bindings: {
    RATE_LIMITER: RateLimitBinding;
  };
};

export const factory = createFactory<AppType>();
