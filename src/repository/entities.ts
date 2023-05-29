import z from "zod";

import { GitHubConfigSchema } from "./github/entities";

type PullRequest = {
	branch: string;
	merged: boolean;
};

enum RepositoryService {
	GitHub = "github",
}

type Repository = {
	service: string;
	owner: string;
	name: string;
	branch: string;
};

const RepositoryClientConfigSchema = z.object({
	github: GitHubConfigSchema.optional(),
});
type RepositoryClientConfig = z.infer<typeof RepositoryClientConfigSchema>;

interface RepositoryClient {
	createBranch(branch: string, commitHash: string): Promise<void>;
	deleteBranch(branch: string): Promise<void>;

	createPullRequest(title: string, branch: string, body: string): Promise<void>;

	createFile(
		filePath: string,
		content: string,
		branch: string,
		commitMessage: string,
	): Promise<void>;

	getHeadCommit(): Promise<string>;

	getFile(filePath: string): Promise<string>;
}

export {
	RepositoryClient,
	RepositoryService,
	Repository,
	RepositoryClientConfig,
	RepositoryClientConfigSchema,
	PullRequest,
};
