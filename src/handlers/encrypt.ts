import { Handler } from "./entities";
import services from "../services";
import { ServiceError } from "../services/entities";

// TODO: Find a way to link params from router to here
const handler: Handler = async (c) => {
	const text = c.req.param("text");

	try {
		const encrypted = await services.encrypt(text);
		return c.text(encrypted);
	} catch (error) {
		const err = error as ServiceError;
		return c.text(err.message, err.statusCode);
	}
};

export default handler;
