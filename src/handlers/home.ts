import services from "../services";

import { Handler } from "./entities";

const handler: Handler = async (c) => {
	return c.text(services.greet());
};

export default handler;
