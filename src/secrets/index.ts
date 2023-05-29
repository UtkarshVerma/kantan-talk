import config from "../config";

function stringToArrayBuffer(str: string) {
	const buffer = new ArrayBuffer(str.length);
	const u8Buffer = new Uint8Array(buffer);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		u8Buffer[i] = str.charCodeAt(i);
	}

	return buffer;
}

function arrayBufferToString(buffer: ArrayBuffer) {
	let binary = "";
	const bytes = new Uint8Array(buffer);
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}

	return binary;
}

class SecretHandler {
	private readonly privateKey: CryptoKey;
	private readonly publicKey: CryptoKey;
	private readonly algorithm: RsaHashedImportParams;

	constructor(
		privateKey: CryptoKey,
		publicKey: CryptoKey,
		algorithm: RsaHashedImportParams,
	) {
		this.privateKey = privateKey;
		this.publicKey = publicKey;
		this.algorithm = algorithm;
	}

	static async new(pem: string) {
		// Remove header and trailer
		const pemHeader = "-----BEGIN PRIVATE KEY-----";
		const pemFooter = "-----END PRIVATE KEY-----";
		const pemContents = pem.substring(
			pemHeader.length,
			pem.length - pemFooter.length,
		);

		const binaryDerString = atob(pemContents);
		const binaryDer = stringToArrayBuffer(binaryDerString);

		const algorithm = {
			name: "RSA-OAEP",
			hash: "SHA-512",
		};

		const privateKey = await crypto.subtle.importKey(
			"pkcs8",
			binaryDer,
			algorithm,
			true,
			["decrypt"],
		);

		const jwk = await crypto.subtle.exportKey("jwk", privateKey);

		// Remove private key data from JWK
		jwk.d = undefined;
		jwk.dp = undefined;
		jwk.dq = undefined;
		jwk.q = undefined;
		jwk.qi = undefined;
		jwk.key_ops = ["encrypt"];

		const publicKey = await crypto.subtle.importKey(
			"jwk",
			jwk,
			algorithm,
			false,
			["encrypt"],
		);

		return new SecretHandler(privateKey, publicKey, algorithm);
	}

	async encrypt(text: string) {
		try {
			const cipher = await crypto.subtle.encrypt(
				this.algorithm,
				this.publicKey,
				stringToArrayBuffer(text),
			);

			const binary = arrayBufferToString(cipher);
			return btoa(binary);
		} catch (error) {
			throw new Error("secrets: could not encrypt");
		}
	}

	async decrypt(encodedCipher: string) {
		try {
			const decoded = atob(encodedCipher);
			const cipher = stringToArrayBuffer(decoded);
			const buffer = await crypto.subtle.decrypt(
				this.algorithm,
				this.privateKey,
				cipher,
			);

			return arrayBufferToString(buffer);
		} catch (error) {
			throw new Error("secrets: could not decrypt");
		}
	}
}

const handler = await SecretHandler.new(config.secrets.privateKey);

export { SecretHandler };
export default handler;
