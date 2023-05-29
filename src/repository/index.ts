import config from "../config";
import GitHubClient from "./github";

import { Repository, RepositoryService } from "./entities";

const RepositoryClient = {
	configFilename: "kantan.yaml",

	async new(repository: Repository) {
		switch (repository.service) {
			case RepositoryService.GitHub:
				if (config.repository.github === undefined)
					throw new Error("repository: service not configured on server");
				return await GitHubClient.new(repository, config.repository.github);
		}

		throw new Error("repository: service unsupported");
	},
};

export default RepositoryClient;
