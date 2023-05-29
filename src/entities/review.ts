import z from "zod";

const ReviewsConfigSchema = z.object({
	title: z.string(),
	body: z.string(),
});

class Review {
	static readonly branchNameFormat = "comment-{{_id}}";

	static validateBranchName(branch: string) {
		return branch.startsWith("comment-");
	}
}

export { ReviewsConfigSchema };
export default Review;
