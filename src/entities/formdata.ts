import z from "zod";

const requiredFields = ["comment"];

const RequiredFieldsSchema = z
	.array(z.string())
	.refine(
		(fields) => requiredFields.every((required) => fields.includes(required)),
		`Missing required fields. Required fields are: ${requiredFields.join(
			", ",
		)}`,
	);

const FormDataConfigSchema = z.object({
	fields: z.object({
		required: RequiredFieldsSchema,
		others: z.array(z.string()),
	}),
});
type FormDataConfig = z.infer<typeof FormDataConfigSchema>;

class FormData {
	private readonly config: FormDataConfig;
	readonly data: Record<string, string>;

	constructor(data: Record<string, string>, config: FormDataConfig) {
		this.config = config;
		this.data = data;
	}

	validate() {
		const missingFields = this.config.fields.required.filter(
			(field) => !(field in this.data),
		);

		return missingFields;
	}
}

export { FormDataConfigSchema };
export default FormData;
