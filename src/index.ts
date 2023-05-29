import { Hono } from "hono";

import handlers from "./handlers";

const app = new Hono();

app.get("/", handlers.home);

// Endpoint for encrypting secrets
app.get("/encrypt/:text", handlers.encrypt);

// Endpoint for handling webhook events
app.post("/webhooks/:service", handlers.webhooks);

// Endpoint for handling new comment requests
app.post("/comments/:service/:owner/:repository/:branch", handlers.comments);

export default app;
