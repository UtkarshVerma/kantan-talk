import sgMail, { MailService } from "@sendgrid/mail";

import secretHandler from "../../secrets";

import { SendGridConfig } from "./entities";
import { Email, EmailClient } from "../entities";

class SendGrid implements EmailClient {
	private readonly service: MailService;

	constructor(apiKey: string) {
		this.service = sgMail;
		this.service.setApiKey(apiKey);
	}

	static async new(config: SendGridConfig) {
		const apiKey = await secretHandler.decrypt(config.apiKey);
		if (apiKey === null) return null;

		return new SendGrid(apiKey);
	}

	async send(email: Email) {
		try {
			await this.service.send({
				to: email.recipient,
				from: email.sender,
				subject: email.subject,
				html: email.message,
			});
		} catch (error) {
			return error as Error;
		}

		return null;
	}
}

export default SendGrid;
