function renderFieldTable(fields: Record<string, string>) {
	if (Object.keys(fields).length === 0) return "";

	const fieldTable = ["---", "Field|Value", "-|-"];
	for (const key in fields) fieldTable.push(`${key}|${fields[key]}`);

	return fieldTable.join("\n");
}

class Parser {
	private readonly variables: Record<string, string>;

	constructor(variables: Record<string, string | undefined>) {
		const fields = Object.keys(variables).reduce((fields, key) => {
			if (!key.startsWith("_")) fields[key] = variables[key] ?? "";

			return fields;
		}, {} as Record<string, string>);

		this.variables = {
			...variables,
			fieldTable: renderFieldTable(fields),
		};
	}

	parse(template: string, overrides?: Record<string, string>) {
		let variables = this.variables;
		if (overrides !== undefined)
			variables = Object.assign({}, this.variables, overrides);

		const pattern = /{{(.*?)}}/g;
		const parsed = template.replace(pattern, (match, key) => {
			const k = key.trim();
			if (k in variables) return variables[key.trim()];

			return match;
		});

		return parsed;
	}
}

export default Parser;
