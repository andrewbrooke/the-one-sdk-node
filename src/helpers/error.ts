import axios from 'axios';

export class OSNError extends Error {
  constructor(msg?: string) {
    super(msg || 'Uh oh, something went wrong');
    Object.setPrototypeOf(this, OSNError.prototype);
  }
}

export class OSNAuthError extends OSNError {
  constructor() {
    super('You must provide a valid API token (see: https://the-one-api.dev/sign-up)');
    Object.setPrototypeOf(this, OSNAuthError.prototype);
  }
}

export class OSNRateLimitError extends OSNError {
  constructor() {
    super('Too many requests, please try again later');
    Object.setPrototypeOf(this, OSNRateLimitError.prototype);
  }
}

export function handleAxiosError(err: unknown) {
  if (axios.isAxiosError(err) && err.response) {
    if (err.response.status === 401) {
      // Unauthorized
      throw new OSNAuthError();
    } else if (err.response.status === 429) {
      // Rate limited
      throw new OSNRateLimitError();
    } else {
      // Unknown Axios error
      throw new OSNError(err.message);
    }
  } else {
    // Unknown error, rethrow
    throw err;
  }
}
