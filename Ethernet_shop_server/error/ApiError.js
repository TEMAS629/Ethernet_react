class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message) {
        return new ApiError(404, message);
    }

    static iternalError(message) {
        return new ApiError(500, message);
    }

    static forbiddenError(message) {
        return new ApiError(400, message)
    }
}

module.exports = ApiError