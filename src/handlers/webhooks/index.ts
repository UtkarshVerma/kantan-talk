import { Handler } from "../entities";

import gitHubWebhookHandler from "./github";

const handler: Handler = async (c) => {
	switch (c.req.param("service")) {
		case "github":
			return await gitHubWebhookHandler(c);
	}

	return c.text("webhook service unsupported", 400);
};

export default handler;
