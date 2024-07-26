import { Hono } from "hono";
import { extractRequestedUrl } from "./urlExtractor";
import { fetchLynkifyUrl } from "./fetch";

const app = new Hono();

app.post("/v1", ...extractRequestedUrl("json", "query"), async (c) => {
  const reqUrl = c.get("url");
  try {
    const url = await fetchLynkifyUrl(reqUrl);
    return c.json({ url });
  } catch (e) {
    return c.json(
      {
        error: "Failed to fetch lynkify url",
      },
      500
    );
  }
});

export default app;
