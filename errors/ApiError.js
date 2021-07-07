class ApiError {
    constructor(code, message) {
      this.code = code;
      this.message = message;
    }
  
    static badRequest(msg) {
      return new ApiError(400, msg);
    }

    static missingField() {
        return new ApiError(400, 'One of the required fields is missing');
    }

    static unauthorized() {
      return new ApiError(403, 'Unauthorized.')
    }
  
    static internal(msg) {
      return new ApiError(500, msg);
    }
  }
  
  module.exports = ApiError;