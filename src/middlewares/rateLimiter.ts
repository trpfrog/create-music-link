import { cloudflareRateLimiter } from "@hono-rate-limiter/cloudflare";
import { AppType, factory } from "../factory";

export const rateLimiter = factory.createMiddleware(async (c, next) => {
  cloudflareRateLimiter<AppType>({
    rateLimitBinding: c.env.RATE_LIMITER,
    keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "", // Method to generate custom identifiers for clients.
  })(c, next);
  await next();
});
