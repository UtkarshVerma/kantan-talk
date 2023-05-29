import z from "zod";

import { AkismetConfigSchema } from "./akismet/entities";
import { Comment } from "../entities";

const SpamFilterSchema = z.object({
	akismet: AkismetConfigSchema.optional(),
});
type SpamFilterConfig = z.infer<typeof SpamFilterSchema>;

interface SpamFilter {
	checkSpam(comment: Comment): Promise<boolean>;
}

export { SpamFilter, SpamFilterConfig, SpamFilterSchema };
