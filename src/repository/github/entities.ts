import z from "zod";

const GitHubConfigSchema = z.object({
	appID: z.number(),
	webhookSecret: z.string(),
	privateKey: z.string(),
});
type GitHubConfig = z.infer<typeof GitHubConfigSchema>;

export { GitHubConfigSchema, GitHubConfig };
