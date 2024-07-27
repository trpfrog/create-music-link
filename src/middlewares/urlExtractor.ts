import { type ValidationTargets } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createMiddleware } from "hono/factory";

declare module "hono" {
  interface ContextVariableMap {
    url: string;
  }
}

function reqUrlValidator<T extends keyof ValidationTargets>(target: T) {
  return zValidator(
    target,
    z.object({
      url: z.string().url().optional(),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: "url must be a valid URL",
          },
          400
        );
      }
    }
  );
}

/**
 * Extracts the requested URL from the request.
 * @param targets The targets to extract the URL from.
 */
export function extractRequestedUrl<T extends (keyof ValidationTargets)[]>(
  ...targets: T
) {
  return [
    ...targets.map((target) => reqUrlValidator(target)),
    createMiddleware(async (c, next) => {
      for (const target of targets) {
        // @ts-expect-error: c.req.valid is not typed
        const url = c.req.valid(target).url as string | undefined;
        if (url != null) {
          c.set("url", url);
          await next();
          return;
        }
      }
      return c.json(
        {
          error: "url is required",
        },
        400
      );
    }),
  ];
}
