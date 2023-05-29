import { EmitterWebhookEvent, Webhooks } from "@octokit/webhooks";

import config from "../../../config.json";
import services from "../../services";

import { Handler } from "../entities";
import { ServiceError } from "../../services/entities";

const webhooks = new Webhooks({
	secret: config.repository.github.webhookSecret,
});

webhooks.on("pull_request.closed", async ({ payload }) => {
	await services.closeReview({
		service: "github",
		owner: payload.repository.owner.login,
		name: payload.repository.name,
		branch: payload.pull_request.base.ref,
		pullRequest: {
			branch: payload.pull_request.head.ref,
			merged: payload.pull_request.merged ?? false,
		},
	});
});

const handler: Handler = async (c) => {
	const body = await c.req.text();

	try {
		const isValid = await webhooks.verify(
			body,
			c.req.header("x-hub-signature-256") ?? "",
		);
		if (!isValid) c.text("invalid request", 400);
	} catch (error) {
		return c.text("invalid signature or payload", 400);
	}

	try {
		await webhooks.receive({
			id: c.req.header("x-github-delivery"),
			name: c.req.header("x-github-event"),
			payload: JSON.parse(body),
		} as EmitterWebhookEvent);
	} catch (error) {
		const err = error as ServiceError;
		return c.text(err.message, err.statusCode);
	}

	return c.text("successful");
};

export default handler;
