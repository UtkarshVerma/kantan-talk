import { EmailConfig } from "./entities";

import SendGrid from "./sendgrid";

const EmailClient = {
	new: async (config: EmailConfig) => {
		if (config.sendgrid !== undefined)
			return await SendGrid.new(config.sendgrid);

		return null;
	},
};

export default EmailClient;
