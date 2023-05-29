import z from "zod";

import { EmailConfigSchema } from "../../email/entities";
import { SpamFilterSchema } from "../../spam/entities";
import { CommentsConfigSchema } from "../../entities/comment";
import { ReviewsConfigSchema } from "../../entities/review";
import { FormDataConfigSchema } from "../../entities/formdata";

const SiteConfigSchema = z.object({
	name: z.string(),
	comments: CommentsConfigSchema,
	formData: FormDataConfigSchema,
	reviews: ReviewsConfigSchema,
	email: EmailConfigSchema,
	spamFilter: SpamFilterSchema,
});
type SiteConfig = z.infer<typeof SiteConfigSchema>;

export { SiteConfig, SiteConfigSchema };
