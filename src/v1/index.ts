import { extractRequestedUrl } from "../middlewares/urlExtractor";
import { fetchLynkifyUrl } from "../fetch";
import { factory } from "../factory";
import {
  createNowPlaygroundTweetUrl,
  generateNowPlaygroundTweet,
} from "./tweet";
import { fetchTrackInfo } from "./fetchTrackInfo";

const app = factory.createApp();

app.use("/", ...extractRequestedUrl("json", "query"));
app.post("/", async (c) => {
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

app.use("/tweet", ...extractRequestedUrl("query", "form", "json"));
app.post("/tweet", async (c) => {
  const reqUrl = c.get("url");
  const { track, lynkifyUrl } = await fetchTrackInfo(c, reqUrl);
  return c.json({
    intentUrl: createNowPlaygroundTweetUrl(track, lynkifyUrl),
    tweetText: generateNowPlaygroundTweet(track, lynkifyUrl),
  });
});
app.get("/tweet", async (c) => {
  const reqUrl = c.get("url");
  const { track, lynkifyUrl } = await fetchTrackInfo(c, reqUrl);
  return c.redirect(createNowPlaygroundTweetUrl(track, lynkifyUrl));
});

export default app;
