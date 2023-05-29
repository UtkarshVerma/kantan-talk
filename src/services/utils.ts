import { SiteConfig } from "../config";
import RepositoryClient from "../repository";

import { RepositoryClient as RepoClient } from "../repository/entities";

async function getRepositoryClientConfig(client: RepoClient) {
	let configFile;
	try {
		configFile = await client.getFile(RepositoryClient.configFilename);
	} catch (error) {
		throw new Error("repository does not have a site config");
	}

	let config;
	try {
		config = SiteConfig.load(configFile);
	} catch (error) {
		throw new Error("site config is invalid");
	}

	const errors = config.validate();
	if (errors) throw new Error(errors);

	return config.config;
}

export { getRepositoryClientConfig };
