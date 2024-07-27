import { rateLimiter } from "./middlewares/rateLimiter";
import { factory } from "./factory";
import v1 from "./v1";

const app = factory.createApp().use(rateLimiter).route("/v1", v1);

export default app;
