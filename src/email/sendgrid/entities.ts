import z from "zod";

const SendGridConfigSchema = z.object({
	apiKey: z.string(),
});
type SendGridConfig = z.infer<typeof SendGridConfigSchema>;

export { SendGridConfig, SendGridConfigSchema };
