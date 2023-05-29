import path from "node:path";
import yaml from "js-yaml";

import { getRepositoryClientConfig } from "./utils";

import RepositoryClient from "../repository";
import { Comment, Review, FormData } from "../entities";
import { Repository } from "../repository/entities";
import Parser from "../parser";
import SpamFilter from "../spam";
import { ServiceError, StatusCode } from "./entities";

async function newComment(options: Repository, data: Record<string, string>) {
	const repo = await RepositoryClient.new(options);
	const config = await getRepositoryClientConfig(repo);
	const spamFilterClient = await SpamFilter.new(config.spamFilter);

	const formData = new FormData(data, config.formData);
	const missingFields = formData.validate();
	if (missingFields.length > 0)
		throw new ServiceError("form data is missing required fields");

	const comment = new Comment(formData.data);
	const parser = new Parser({
		...formData.data,
		_id: comment.id,
	});

	if (comment.parentID !== undefined) {
		const template = path.join(config.comments.dir, Comment.fileNameFormat);
		const parentFilePath = parser.parse(template, { _id: comment.parentID });

		try {
			await repo.getFile(parentFilePath);
		} catch (error) {
			throw new ServiceError("invalid parent ID");
		}
	}

	const isSpam = await spamFilterClient.checkSpam(comment);
	if (isSpam)
		throw new ServiceError(
			"comment is spam",
			StatusCode.UnavailableForLegalReasons,
		);

	const commitHash = await repo.getHeadCommit();
	const branch = parser.parse(Review.branchNameFormat);
	await repo.createBranch(branch, commitHash);

	const filePath = parser.parse(
		path.join(config.comments.dir, Comment.fileNameFormat),
	);
	const file = yaml.dump(comment.dump());
	const commitMessage = parser.parse(config.comments.commitMessage);

	await repo.createFile(filePath, file, branch, commitMessage);

	const title = parser.parse(config.reviews.title);
	const body = parser.parse(config.reviews.body);
	await repo.createPullRequest(branch, title, body);

	return "comment review initiated successfully";
}

export { newComment };
