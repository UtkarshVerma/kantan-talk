import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

import { GitHubConfig } from "./entities";
import { RepositoryClient, Repository } from "../entities";

class GitHubClient implements RepositoryClient {
	readonly owner: string;
	readonly repository: string;
	readonly branch: string;
	private readonly api: Octokit;

	constructor(options: Repository, api: Octokit) {
		this.owner = options.owner;
		this.repository = options.name;
		this.branch = options.branch;
		this.api = api;
	}

	static async new(repository: Repository, config: GitHubConfig) {
		let api = new Octokit({
			authStrategy: createAppAuth,
			auth: {
				appId: config.appID,
				privateKey: config.privateKey,
			},
		});

		const { data } = await api.apps.getRepoInstallation({
			owner: repository.owner,
			repo: repository.name,
		});
		const installationID = data.id;

		api = new Octokit({
			authStrategy: createAppAuth,
			auth: {
				appId: config.appID,
				privateKey: config.privateKey,
				installationId: installationID,
			},
		});

		const repo = new GitHubClient(repository, api);

		return repo;
	}

	async getFile(filePath: string) {
		const { data } = await this.api.repos.getContent({
			owner: this.owner,
			repo: this.repository,
			path: filePath,
			ref: this.branch,
			mediaType: {
				format: "raw",
			},
		});

		return data.toString();
	}

	async getHeadCommit() {
		const { data } = await this.api.repos.getBranch({
			owner: this.owner,
			repo: this.repository,
			branch: this.branch,
		});

		return data.commit.sha;
	}

	async createBranch(branch: string, commitHash: string) {
		await this.api.git.createRef({
			owner: this.owner,
			repo: this.repository,
			ref: `refs/heads/${branch}`,
			sha: commitHash,
		});
	}

	async deleteBranch(branch: string) {
		await this.api.git.deleteRef({
			owner: this.owner,
			repo: this.repository,
			ref: `heads/${branch}`,
		});
	}

	async createPullRequest(branch: string, title: string, body: string) {
		await this.api.pulls.create({
			owner: this.owner,
			repo: this.repository,
			head: branch,
			title: title,
			base: this.branch,
			body: body,
		});
	}

	async createFile(
		filePath: string,
		content: string,
		branch: string,
		commitMessage: string,
	) {
		await this.api.repos.createOrUpdateFileContents({
			owner: this.owner,
			repo: this.repository,
			path: filePath,
			message: commitMessage,
			content: btoa(content),
			branch: branch,
		});
	}
}

export default GitHubClient;
