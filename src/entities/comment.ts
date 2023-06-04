import z from "zod";

const CommentsConfigSchema = z.object({
	dir: z.string(),
	commitMessage: z.string(),
});

type CommentID = string;

type Commentor = {
	name?: string;
	email?: string;
	website?: string;
};

class Comment {
	readonly id: CommentID;
	readonly parentID?: CommentID;
	private readonly date: string;
	readonly commentor?: Commentor;
	readonly text: string;

	static readonly fileNameFormat = "comment-{{_id}}.yaml";

	constructor(formData: Record<string, string>) {
		this.id = formData["_id"] ?? crypto.randomUUID();

		// NOTE: _parentID could also be an empty string
		this.parentID = formData["_parentID"] ? formData["_parentID"] : undefined;

		this.commentor = {
			name: formData["name"],
			email: formData["email"],
			website: formData["website"],
		};
		this.text = formData["comment"];
		this.date = new Date().toISOString();
	}

	dump() {
		return {
			_id: this.id,
			_parentID: this.parentID,
			_date: this.date,
			commentor: this.commentor,
			text: this.text,
		};
	}
}

export { CommentsConfigSchema };
export default Comment;
