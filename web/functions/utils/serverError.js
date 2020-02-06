module.exports = class ServerError extends Error {
  constructor(statusCode, message, config = {}) {
    // Calling parent constructor of base Error class.
    super(message);

    // save class name in the property of our custom error as a shortcut
    this.name = this.constructor.name;

    // capturing stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);

    // add additional properties
    this.statusCode = statusCode || 500;
    this.headers = config.headers || {};
  }
};
