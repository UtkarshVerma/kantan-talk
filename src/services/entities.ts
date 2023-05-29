enum StatusCode {
	BadRequest = 400,
	Unauthorized = 401,
	NotFound = 404,
	UnavailableForLegalReasons = 451,

	InternalError = 500,
	BadGateway = 502,

	Invalid = -1,
}

class ServiceError extends Error {
	readonly statusCode: StatusCode;

	constructor(message: string, statusCode: StatusCode = StatusCode.BadRequest) {
		super(message);

		this.statusCode = statusCode;
	}
}

export { ServiceError, StatusCode };
