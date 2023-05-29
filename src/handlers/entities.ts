import { Context } from "hono";

type Handler = (c: Context) => Promise<Response>;

export { Handler };
