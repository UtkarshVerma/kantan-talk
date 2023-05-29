import z from "zod";

import { SendGridConfigSchema } from "./sendgrid/entities";

type Email = {
	sender: string;
	recipient: string;
	subject: string;
	message: string;
};

interface EmailClient {
	send(email: Email): Promise<null | Error>;
}

const EmailConfigSchema = z.object({
	sendgrid: SendGridConfigSchema,
});
type EmailConfig = z.infer<typeof EmailConfigSchema>;

export { Email, EmailClient, EmailConfig, EmailConfigSchema };
