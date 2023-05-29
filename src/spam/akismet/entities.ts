import z from "zod";

const AkismetConfigSchema = z.object({
	apiKey: z.string(),
	site: z.string().url(),
});
type AkismetConfig = z.infer<typeof AkismetConfigSchema>;

export { AkismetConfig, AkismetConfigSchema };
