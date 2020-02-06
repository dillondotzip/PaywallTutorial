const ServerError = require('./serverError');

module.exports = async function validateHttpMethod(event, allowedMethods) {
  try {
    // check if request method allowed
    if (!allowedMethods.some(method => method === event.httpMethod)) {
      throw new ServerError(405, `${event.httpMethod} is not allowed`, {
        headers: {
          Allowed: JSON.stringify(allowedMethods),
        },
      });
    }
  } catch (error) {
    // pass error up
    throw error;
  }
};
