import secretHandler from "../../secrets";

import { Comment } from "../../entities";
import { SpamFilter } from "../entities";
import { AkismetConfig } from "./entities";

enum AkismetEndpoint {
	VerifyKey = "verify-key",
	CommentCheck = "comment-check",
}

// TODO: pass the request IP address
class Akismet implements SpamFilter {
	private readonly baseURL = "https://rest.akismet.com/1.1/";
	private readonly apiKey: string;
	private readonly blog: string;

	constructor(apiKey: string, blog: string) {
		this.apiKey = apiKey;
		this.blog = blog;
	}

	static async new(config: AkismetConfig) {
		const apiKey = await secretHandler.decrypt(config.apiKey);
		if (apiKey === null) throw new Error("akismet: could not decrypt API key");

		const client = new Akismet(apiKey, config.site);
		const isValid = await client.verifyKey();
		if (!isValid) throw new Error("akismet: invalid API key");

		return client;
	}

	private async post(url: string, payload: Record<string, string>) {
		const queryString = new URLSearchParams(payload).toString();
		const response = await fetch(url, {
			method: "POST",
			headers: new Headers({
				"content-type": "application/x-www-form-urlencoded",
			}),
			body: queryString,
		});

		return response;
	}

	async verifyKey() {
		const url = `${this.baseURL}${AkismetEndpoint.VerifyKey}`;

		const payload = {
			api_key: this.apiKey,
			blog: this.blog,
		};

		const response = await this.post(url, payload);
		if ((await response.text()) === "valid") return true;

		return false;
	}

	async checkSpam(comment: Comment) {
		const url = `${this.baseURL}${AkismetEndpoint.CommentCheck}`;
		const payload: Record<string, string> = {
			api_key: this.apiKey,
			blog: this.blog,
			comment_type: comment.parentID ? "reply" : "comment",
			comment_content: comment.text,
		};

		if (comment.commentor !== undefined) {
			if (comment.commentor.name !== undefined)
				payload["comment_author"] = comment.commentor.name;
			if (comment.commentor.email !== undefined)
				payload["comment_author_email"] = comment.commentor.email;
			if (comment.commentor.website !== undefined)
				payload["comment_author_url"] = comment.commentor.website;
		}

		const response = await this.post(url, payload);
		const text = await response.text();
		if (text === "true") return true;
		if (text === "false") return false;
		if (text === "invalid") throw new Error("akismet: invalid API key");

		const debugHeader = response.headers.get("x-akismet-debug-help");
		if (debugHeader) throw new Error(debugHeader);

		throw new Error(text);
	}
}

export default Akismet;
