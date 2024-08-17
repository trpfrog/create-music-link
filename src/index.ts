import { rateLimiter } from "./middlewares/rateLimiter";
import { factory } from "./factory";
import { app as demoPageApp } from "./demoPage";
import v1 from "./v1";

const api = factory.createApp().use(rateLimiter).route("/v1", v1);

const app = factory
  .createApp()
  .route("/", demoPageApp)
  .route("/", api)
  .onError((e, c) => {
    console.error(e.cause);
    return c.json({ error: "Internal server error", message: e.message }, 500);
  });

export default app;
