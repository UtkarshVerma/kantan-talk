import secretHandler from "../secrets";
import { ServiceError, StatusCode } from "./entities";

async function encrypt(text: string) {
	try {
		const encrypted = await secretHandler.encrypt(text);
		return encrypted;
	} catch (error) {
		throw new ServiceError((error as Error).message, StatusCode.InternalError);
	}
}

export { encrypt };
