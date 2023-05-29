import pkg from "../../package.json";

function greet() {
	return `${pkg.name} v${pkg.version} is up and running!`;
}

export { greet };
