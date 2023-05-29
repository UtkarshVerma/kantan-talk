import z from "zod";

const SecretsConfigSchema = z.object({
	privateKey: z.string(),
});
type SecretsConfig = z.infer<typeof SecretsConfigSchema>;

export { SecretsConfig, SecretsConfigSchema };
