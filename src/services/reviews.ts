import { ServiceError } from "./entities";
import { PullRequest, Repository } from "../repository/entities";
import RepositoryClient from "../repository";
import { Review } from "../entities";

type Options = Repository & {
	pullRequest: PullRequest;
};

async function closeReview(options: Options) {
	const repo = await RepositoryClient.new(options);

	const isReview = Review.validateBranchName(options.pullRequest.branch);
	if (!isReview) throw new ServiceError("passed branch is not a review");

	await repo.deleteBranch(options.pullRequest.branch);

	return "review closed successfully";
}

export { closeReview };
