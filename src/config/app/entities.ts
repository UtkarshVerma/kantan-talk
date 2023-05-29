import z from "zod";

import { RepositoryClientConfigSchema } from "../../repository/entities";
import { SecretsConfigSchema } from "../../secrets/entities";

const AppConfigSchema = z.object({
	secrets: SecretsConfigSchema,
	repository: RepositoryClientConfigSchema,
});
type AppConfig = z.infer<typeof AppConfigSchema>;

export { AppConfig, AppConfigSchema };
