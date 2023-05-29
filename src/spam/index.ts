import Akismet from "./akismet";

import { SpamFilterConfig } from "./entities";

// TODO: Add support for marking false positives
const SpamFilter = {
	async new(config: SpamFilterConfig) {
		if (config.akismet !== undefined) return await Akismet.new(config.akismet);

		throw new Error("spam filter not configured on server");
	},
};

export default SpamFilter;
