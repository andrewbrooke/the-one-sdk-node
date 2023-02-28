# the-one-sdk-node

NodeJS wrapper for [the-one-api.dev](https://the-one-api.dev)

## Installation

`npm i the-one-sdk`

## Usage

Obtain an API token for The One API here: https://the-one-api.dev/sign-up

```js
import OneSDK from 'the-one-sdk';

const sdk = new OneSDK({
  token: 'my-token',
});
```

### Get a Movie by ID

```js
const movie = await api.getMovie('5cd95395de30eff6ebccde5c');

/*
{
  "_id": "5cd95395de30eff6ebccde5c",
  "name": "The Fellowship of the Ring",
  "runtimeInMinutes": 178,
  "budgetInMillions": 93,
  "boxOfficeRevenueInMillions": 871.5,
  "academyAwardNominations": 13,
  "academyAwardWins": 4,
  "rottenTomatoesScore": 91
}
*/
```

### Get all Movies

```js
const movies = await api.getMovies({
  limit: 2,
});

/*
{
  "items": [
    {
      "_id": "5cd95395de30eff6ebccde56",
      "name": "The Lord of the Rings Series",
      "runtimeInMinutes": 558,
      "budgetInMillions": 281,
      "boxOfficeRevenueInMillions": 2917,
      "academyAwardNominations": 30,
      "academyAwardWins": 17,
      "rottenTomatoesScore": 94
    },
    {
      "_id": "5cd95395de30eff6ebccde57",
      "name": "The Hobbit Series",
      "runtimeInMinutes": 462,
      "budgetInMillions": 675,
      "boxOfficeRevenueInMillions": 2932,
      "academyAwardNominations": 7,
      "academyAwardWins": 1,
      "rottenTomatoesScore": 66.33333333
    }
  ],
  "hasNext": true,
  "next": [Function: next]
}
*/
```

### Get Quotes by Movie

```js
const movies = await api.getMovieQuotes('5cd95395de30eff6ebccde5c' {
  limit: 2,
});

/*
{
  "items": [
    {
      "_id": "5cd96e05de30eff6ebcced61",
      "dialog": "Who is she? This woman you sing of?",
      "movie": "5cd95395de30eff6ebccde5c",
      "character": "5cd99d4bde30eff6ebccfc15",
      "id": "5cd96e05de30eff6ebcced61"
    },
    {
      "_id": "5cd96e05de30eff6ebcced62",
      "dialog": "Tis the Lady of L'thien. The Elf Maiden who gave her love to Beren ... a mortal.",
      "movie": "5cd95395de30eff6ebccde5c",
      "character": "5cd99d4bde30eff6ebccfbe6",
      "id": "5cd96e05de30eff6ebcced62"
    }
  ],
  "hasNext": true,
  "next": [Function: next]
}
*/
```

## Pagination & Filtering

For API endpoints that return multiple items, (`getMovies` & `getMovieQuotes`), the following arguments may be provided:

```js
{
  limit: number;
  page: number;
  sort: string;
  filter: string;
}
```

See [API Documentation](https://the-one-api.dev/documentation#5) for usage.

### Pagination Example

To get a list of all movies page by page, an approach similar to the following can be used:

```js
const movies = [];
let response = await api.getMovies({
  limit: 2,
});

movies.push(...response.items);

while (response.hasNext) {
  response = await response.next();
  movies.push(...response.items);
}
```

## Development

To build the SDK locally, install the packages with `yarn install`

Build: `yarn build`

Test: `yarn test`
