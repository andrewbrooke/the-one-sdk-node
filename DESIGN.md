# the-one-sdk-node

## Design Comments

This projects exists to mirror the Lord of the Rings API provided at https://the-one-api.dev/ as a Node module.

Currently, the only supported routes are

```
/movie
/movie/{id}
/movie/{id}/quote
```

### Stack

- Language: NodeJS, TypeScript
- Tests: Mocha, Chai, Nock

### Architecture

Built as a Node module, the entrypoint for this SDK is the default class exposed in `src/index.ts` (OneSDK)

Leveraging the class design, we can instantiate the SDK in the consuming application and provide the API auth token

```js
import OneSDK from 'the-one-sdk';

const sdk = new OneSDK({
  token: 'my-token',
});
```

This class houses our methods that mirror the API:

```
getMovies -> /movie
getMovie -> /movie/{id}
getMovieQuotes -> /movie/{id}/quote
```

For future paginated routes (like `getMovies` and `getMovieQuotes`) we use a generically typed `handlePaginatedRequest` under the hood to provide the pagination logic for a given type of data.

The aforementioned types are located in `src/types`

Errors are routed to our error helper in `helpers/error`

### Tests

Located in `src/test`, tests are run with Mocha and use Chai & chai-as-promised for assertions.

Nock is used to intercept and mock the underlying Axios requests to the API.
