const { snakeToPascal } = require("./helpers");


const errorTypes = [
  ['BAD_INPUT_ERROR', 400, 'One of the fields provided is not valid'],
  ['VALIDATION_ERROR', 400, 'Validation for data provided failed'],
  ['DUPLICATE_ENTRY', 400, 'One of the fields provided is already taken'],
  ['UNAUTHORIZED', 401, 'You are not authorized to access this resource', {}],
  ['NOT_FOUND', 404, 'No resource found for the given data'],
  ['EXPECTATION_FAILED', 417, 'No resource found for the given data'],
  ['FORBIDDEN', 403, 'You are forbidden from accessing this resource.'],
  ['INTERNAL_SERVER_ERROR', 500, 'Oops, something went wrong'],
  ['REQUEST_TIMEOUT', 403, 'Session Timeout'],
];

const errors = {};

errorTypes.forEach((errorType) => {
  errors[snakeToPascal(errorType[0])] = class extends Error {
    constructor(message) {
      super(message || errorType[2]);
      [this.code, this.status] = errorType;
      this.message = message?.message || message || errorType[2];
      this.attributes = message?.showModal || message?.showModal || errorType[3]
    }
  };
});

module.exports = errors;
