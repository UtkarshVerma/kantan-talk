import z from "zod";

class Config<T, SchemaT extends z.ZodTypeAny> {
	readonly config: T;
	private readonly schema: SchemaT;

	constructor(config: T, schema: SchemaT) {
		this.config = config;
		this.schema = schema;
	}

	validate() {
		const result = this.schema.safeParse(this.config);
		if (!result.success) {
			const errors = result.error.issues.reduce((issues, issue) => {
				issues.push({
					message: issue.message,
					path: issue.path.join("."),
				});

				return issues;
			}, [] as Array<Record<string, string>>);
			return JSON.stringify(errors);
		}

		return null;
	}
}

export { Config };
