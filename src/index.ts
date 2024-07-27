import { rateLimiter } from "./middlewares/rateLimiter";
import { factory } from "./factory";
import { app as demoPageApp } from "./demoPage";
import v1 from "./v1";

const api = factory.createApp().use(rateLimiter).route("/v1", v1);

const app = factory.createApp().route("/", demoPageApp).route("/", api);

export default app;
