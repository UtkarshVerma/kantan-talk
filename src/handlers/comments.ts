import services from "../services";
import { ServiceError } from "../services/entities";
import { Handler } from "./entities";

type RequestParams = {
	service: string;
	owner: string;
	repository: string;
	branch: string;
};

const handler: Handler = async (c) => {
	const params = c.req.param() as RequestParams;
	const body = await c.req.parseBody();

	try {
		const response = await services.newComment(
			{
				service: params.service,
				owner: params.owner,
				name: params.repository,
				branch: params.branch,
			},
			body as Record<string, string>,
		);

		return c.text(response);
	} catch (error) {
		const err = error as ServiceError;
		return c.text(err.message, err.statusCode);
	}
};

export default handler;
