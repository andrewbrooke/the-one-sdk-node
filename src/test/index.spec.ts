import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import _ from 'lodash';
import { AxiosInstance } from 'axios';
import nock from 'nock';

import OneSDK from '../index';
import { OSNAuthError, OSNRateLimitError, OSNError } from '../helpers/error';

class OneSDKTest extends OneSDK {
  getAxios(): AxiosInstance {
    return this.Axios;
  }
}

const BASE_URL = 'https://the-one-api.dev/v2';

describe('OneSDK', () => {
  it('should instantiate OneSDK and set Authorization header', () => {
    const mockToken = 'token';
    const expectedHeader = `Bearer ${mockToken}`;

    const SDK = new OneSDKTest({ token: mockToken });

    const authHeader = SDK.getAxios().defaults.headers.common['Authorization'];

    expect(SDK).to.be.an.instanceOf(OneSDK);
    expect(authHeader).to.eql(expectedHeader);
  });

  describe('getMovie', () => {
    it('should reject with OSNAuthError if Authorization header is invalid', async () => {
      const mockToken = 'INVALID';
      const mockMovieId = 'movieId';

      nock(BASE_URL, {
        reqheaders: {
          authorization: `Bearer ${mockToken}`,
        },
      })
        .get(`/movie/${mockMovieId}`)
        .reply(401);

      const SDK = new OneSDKTest({ token: mockToken });

      await expect(SDK.getMovie(mockMovieId)).to.be.rejectedWith(OSNAuthError);
    });
    it('should reject with OSNRateLimitError if rate limit is exceeded', async () => {
      const mockMovieId = 'movieId';

      nock(BASE_URL).get(`/movie/${mockMovieId}`).reply(429);

      const SDK = new OneSDKTest({ token: 'token' });

      await expect(SDK.getMovie(mockMovieId)).to.be.rejectedWith(OSNRateLimitError);
    });
    it('should reject with OSNError if an unspecified Axios error occurs', async () => {
      const mockMovieId = 'movieId';

      nock(BASE_URL).get(`/movie/${mockMovieId}`).reply(555);

      const SDK = new OneSDKTest({ token: 'token' });

      await expect(SDK.getMovie(mockMovieId)).to.be.rejectedWith(OSNError);
    });
    it('should reject with bubbled error if an unspecified non-Axios error occurs', async () => {
      const mockMovieId = 'movieId';

      nock(BASE_URL)
        .get(`/movie/${mockMovieId}`)
        .replyWithError({ message: 'Something really bad happened', code: 'BAD' });

      const SDK = new OneSDKTest({ token: 'token' });

      await expect(SDK.getMovie(mockMovieId))
        .to.eventually.be.rejected.and.be.an.instanceOf(Error)
        .and.have.property('code', 'BAD');
    });
    it('should resolve with single movie', async () => {
      const mockMovieId = 'movieId';

      const mockMovie = {
        _id: '5cd95395de30eff6ebccde5c',
        name: 'The Fellowship of the Ring',
        runtimeInMinutes: 178,
        budgetInMillions: 93,
        boxOfficeRevenueInMillions: 871.5,
        academyAwardNominations: 13,
        academyAwardWins: 4,
        rottenTomatoesScore: 91,
      };

      nock(BASE_URL)
        .get(`/movie/${mockMovieId}`)
        .reply(200, {
          docs: [mockMovie],
          total: 1,
          limit: 1000,
          offset: 0,
          page: 1,
          pages: 1,
        });

      const SDK = new OneSDKTest({ token: 'token' });

      const result = await SDK.getMovie(mockMovieId);

      expect(result).to.eql(mockMovie);
    });
  });

  describe('getMovies', () => {
    it('should reject with OSNAuthError if Authorization header is invalid', async () => {
      const mockToken = 'INVALID';

      nock(BASE_URL, {
        reqheaders: {
          authorization: `Bearer ${mockToken}`,
        },
      })
        .get(`/movie`)
        .query({ page: '1' })
        .reply(401);

      const SDK = new OneSDKTest({ token: mockToken });

      await expect(SDK.getMovies()).to.be.rejectedWith(OSNAuthError);
    });
    it('should reject with OSNRateLimitError if rate limit is exceeded', async () => {
      nock(BASE_URL).get(`/movie`).query({ page: '1' }).reply(429);

      const SDK = new OneSDKTest({ token: 'token' });

      await expect(SDK.getMovies()).to.be.rejectedWith(OSNRateLimitError);
    });
    it('should reject with OSNError if an unspecified Axios error occurs', async () => {
      nock(BASE_URL).get(`/movie`).query({ page: '1' }).reply(555);

      const SDK = new OneSDKTest({ token: 'token' });

      await expect(SDK.getMovies()).to.be.rejectedWith(OSNError);
    });
    it('should reject with bubbled error if an unspecified non-Axios error occurs', async () => {
      nock(BASE_URL)
        .get(`/movie`)
        .query({ page: '1' })
        .replyWithError({ message: 'Something really bad happened', code: 'BAD' });

      const SDK = new OneSDKTest({ token: 'token' });

      await expect(SDK.getMovies())
        .to.eventually.be.rejected.and.be.an.instanceOf(Error)
        .and.have.property('code', 'BAD');
    });
    it('should resolve with paginated movies page by page through next method', async () => {
      const mockMovies = [
        {
          _id: '5cd95395de30eff6ebccde56',
          name: 'The Lord of the Rings Series',
          runtimeInMinutes: 558,
          budgetInMillions: 281,
          boxOfficeRevenueInMillions: 2917,
          academyAwardNominations: 30,
          academyAwardWins: 17,
          rottenTomatoesScore: 94,
        },
        {
          _id: '5cd95395de30eff6ebccde57',
          name: 'The Hobbit Series',
          runtimeInMinutes: 462,
          budgetInMillions: 675,
          boxOfficeRevenueInMillions: 2932,
          academyAwardNominations: 7,
          academyAwardWins: 1,
          rottenTomatoesScore: 66.33333333,
        },
        {
          _id: '5cd95395de30eff6ebccde58',
          name: 'The Unexpected Journey',
          runtimeInMinutes: 169,
          budgetInMillions: 200,
          boxOfficeRevenueInMillions: 1021,
          academyAwardNominations: 3,
          academyAwardWins: 1,
          rottenTomatoesScore: 64,
        },
      ];

      // Mock first page with single result
      nock(BASE_URL)
        .get(`/movie`)
        .query({ limit: '1', page: '1' })
        .reply(200, {
          docs: [mockMovies[0]],
          total: 3,
          limit: 1,
          page: 1,
          pages: 3,
        });

      const SDK = new OneSDKTest({ token: 'token' });

      const resultPage1 = await SDK.getMovies({ limit: 1 });

      expect(resultPage1.items).to.eql([mockMovies[0]]);
      expect(resultPage1.hasNext).to.eql(true);

      // Mock second and third pages
      nock(BASE_URL)
        .get(`/movie`)
        .query({ limit: '1', page: '2' })
        .reply(200, {
          docs: [mockMovies[1]],
          total: 3,
          limit: 1,
          page: 2,
          pages: 3,
        });
      nock(BASE_URL)
        .get(`/movie`)
        .query({ limit: '1', page: '3' })
        .reply(200, {
          docs: [mockMovies[2]],
          total: 3,
          limit: 1,
          page: 3,
          pages: 3,
        });

      const resultPage2 = await resultPage1.next();

      expect(resultPage2.items).to.eql([mockMovies[1]]);
      expect(resultPage2.hasNext).to.eql(true);

      const resultPage3 = await resultPage2.next();

      expect(resultPage3.items).to.eql([mockMovies[2]]);
      expect(resultPage3.hasNext).to.eql(false);
    });
    it('should apply the filter parameter', async () => {
      const mockMovies = [
        {
          _id: '5cd95395de30eff6ebccde57',
          name: 'The Hobbit Series',
          runtimeInMinutes: 462,
          budgetInMillions: 675,
          boxOfficeRevenueInMillions: 2932,
          academyAwardNominations: 7,
          academyAwardWins: 1,
          rottenTomatoesScore: 66.33333333,
        },
      ];

      const mockFilter = '_id!=5cd95395de30eff6ebccde56';

      // Mock first page with single result
      nock(BASE_URL)
        .get(`/movie?${mockFilter}&limit=1&page=1`) // NOTE: workaround for .query chain, nock does not seem to work properly with the API's filter syntax
        .reply(200, {
          docs: [mockMovies[0]],
          total: 3,
          limit: 1,
          page: 1,
          pages: 3,
        });

      const SDK = new OneSDKTest({ token: 'token' });

      const resultPage1 = await SDK.getMovies({
        limit: 1,
        filter: mockFilter,
      });

      expect(resultPage1.items).to.eql([mockMovies[0]]);
      expect(resultPage1.hasNext).to.eql(true);
    });
  });

  describe('getMovieQuotes', () => {
    it('should reject with OSNAuthError if Authorization header is invalid', async () => {
      const mockToken = 'INVALID';
      const mockMovieId = 'movieId';

      nock(BASE_URL, {
        reqheaders: {
          authorization: `Bearer ${mockToken}`,
        },
      })
        .get(`/movie/${mockMovieId}/quote`)
        .query({ page: '1' })
        .reply(401);

      const SDK = new OneSDKTest({ token: mockToken });

      await expect(SDK.getMovieQuotes(mockMovieId)).to.be.rejectedWith(OSNAuthError);
    });
    it('should reject with OSNRateLimitError if rate limit is exceeded', async () => {
      const mockMovieId = 'movieId';

      nock(BASE_URL).get(`/movie/${mockMovieId}/quote`).query({ page: '1' }).reply(429);

      const SDK = new OneSDKTest({ token: 'token' });

      await expect(SDK.getMovieQuotes(mockMovieId)).to.be.rejectedWith(OSNRateLimitError);
    });
    it('should reject with OSNError if an unspecified Axios error occurs', async () => {
      const mockMovieId = 'movieId';

      nock(BASE_URL).get(`/movie/${mockMovieId}/quote`).query({ page: '1' }).reply(555);

      const SDK = new OneSDKTest({ token: 'token' });

      await expect(SDK.getMovieQuotes(mockMovieId)).to.be.rejectedWith(OSNError);
    });
    it('should reject with bubbled error if an unspecified non-Axios error occurs', async () => {
      const mockMovieId = 'movieId';

      nock(BASE_URL)
        .get(`/movie/${mockMovieId}/quote`)
        .query({ page: '1' })
        .replyWithError({ message: 'Something really bad happened', code: 'BAD' });

      const SDK = new OneSDKTest({ token: 'token' });

      await expect(SDK.getMovieQuotes(mockMovieId))
        .to.eventually.be.rejected.and.be.an.instanceOf(Error)
        .and.have.property('code', 'BAD');
    });
    it('should resolve with paginated movie quotes page by page through next method', async () => {
      const mockMovieId = 'movieId';
      const mockMovieQuotes = [
        {
          _id: '5cd96e05de30eff6ebcced61',
          dialog: 'Who is she? This woman you sing of?',
          movie: '5cd95395de30eff6ebccde5c',
          character: '5cd99d4bde30eff6ebccfc15',
          id: '5cd96e05de30eff6ebcced61',
        },
        {
          _id: '5cd96e05de30eff6ebcced62',
          dialog:
            "Tis the Lady of L'thien. The Elf Maiden who gave her love to Beren ... a mortal.",
          movie: '5cd95395de30eff6ebccde5c',
          character: '5cd99d4bde30eff6ebccfbe6',
          id: '5cd96e05de30eff6ebcced62',
        },
        {
          _id: '5cd96e05de30eff6ebcced64',
          dialog: "What are they eating when they can't get hobbit?",
          movie: '5cd95395de30eff6ebccde5c',
          character: '5cd99d4bde30eff6ebccfc7c',
          id: '5cd96e05de30eff6ebcced64',
        },
      ];

      // Mock first page with single result
      nock(BASE_URL)
        .get(`/movie/${mockMovieId}/quote`)
        .query({ limit: '1', page: '1' })
        .reply(200, {
          docs: [mockMovieQuotes[0]],
          total: 3,
          limit: 1,
          page: 1,
          pages: 3,
        });

      const SDK = new OneSDKTest({ token: 'token' });

      const resultPage1 = await SDK.getMovieQuotes(mockMovieId, { limit: 1 });

      expect(resultPage1.items).to.eql([mockMovieQuotes[0]]);
      expect(resultPage1.hasNext).to.eql(true);

      // Mock second and third pages
      nock(BASE_URL)
        .get(`/movie/${mockMovieId}/quote`)
        .query({ limit: '1', page: '2' })
        .reply(200, {
          docs: [mockMovieQuotes[1]],
          total: 3,
          limit: 1,
          page: 2,
          pages: 3,
        });
      nock(BASE_URL)
        .get(`/movie/${mockMovieId}/quote`)
        .query({ limit: '1', page: '3' })
        .reply(200, {
          docs: [mockMovieQuotes[2]],
          total: 3,
          limit: 1,
          page: 3,
          pages: 3,
        });

      const resultPage2 = await resultPage1.next();

      expect(resultPage2.items).to.eql([mockMovieQuotes[1]]);
      expect(resultPage2.hasNext).to.eql(true);

      const resultPage3 = await resultPage2.next();

      expect(resultPage3.items).to.eql([mockMovieQuotes[2]]);
      expect(resultPage3.hasNext).to.eql(false);
    });
    it('should apply the filter parameter', async () => {
      const mockMovieId = 'movieId';
      const mockMovieQuotes = [
        {
          _id: '5cd96e05de30eff6ebcced61',
          dialog: 'Who is she? This woman you sing of?',
          movie: '5cd95395de30eff6ebccde5c',
          character: '5cd99d4bde30eff6ebccfc15',
          id: '5cd96e05de30eff6ebcced61',
        },
      ];

      const mockFilter = 'character=5cd99d4bde30eff6ebccfc15';

      // Mock first page with single result
      nock(BASE_URL)
        .get(`/movie/${mockMovieId}/quote?${mockFilter}&limit=1&page=1`) // NOTE: workaround for .query chain, nock does not seem to work properly with the API's filter syntax
        .reply(200, {
          docs: [mockMovieQuotes[0]],
          total: 3,
          limit: 1,
          page: 1,
          pages: 3,
        });

      const SDK = new OneSDKTest({ token: 'token' });

      const resultPage1 = await SDK.getMovieQuotes(mockMovieId, {
        limit: 1,
        filter: mockFilter,
      });

      expect(resultPage1.items).to.eql([mockMovieQuotes[0]]);
      expect(resultPage1.hasNext).to.eql(true);
    });
  });
});
