import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import _ from 'lodash';
import { AxiosInstance } from 'axios';
import nock from 'nock';

import OneSDK, { PaginatedResponse } from '../index';
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

  describe('Programmatic method tests', () => {
    const mockId = 'mockId';
    const mockToken = 'token';

    const SDK = new OneSDKTest({ token: mockToken });
    const methodMap = [
      {
        name: 'getBook',
        method: SDK.getBook,
        args: [mockId],
        path: `/book/${mockId}`,
        query: undefined,
        data: [
          {
            _id: '5cf5805fb53e011a64671582',
            name: 'The Fellowship Of The Ring',
          },
        ],
      },
      {
        name: 'getMovie',
        method: SDK.getMovie,
        args: [mockId],
        path: `/movie/${mockId}`,
        query: undefined,
        data: [
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
        ],
      },
      {
        name: 'getCharacter',
        method: SDK.getCharacter,
        args: [mockId],
        path: `/character/${mockId}`,
        query: undefined,
        data: [
          {
            _id: '5cd99d4bde30eff6ebccfbbe',
            height: '',
            race: 'Human',
            gender: 'Female',
            birth: '',
            spouse: 'Belemir',
            death: '',
            realm: '',
            hair: '',
            name: 'Adanel',
            wikiUrl: 'http://lotr.wikia.com//wiki/Adanel',
          },
        ],
      },
      {
        name: 'getQuote',
        method: SDK.getQuote,
        args: [mockId],
        path: `/quote/${mockId}`,
        query: undefined,
        data: [
          {
            _id: '5cd96e05de30eff6ebcce7e9',
            dialog: 'Deagol!',
            movie: '5cd95395de30eff6ebccde5d',
            character: '5cd99d4bde30eff6ebccfe9e',
            id: '5cd96e05de30eff6ebcce7e9',
          },
        ],
      },
      {
        name: 'getChapter',
        method: SDK.getChapter,
        args: [mockId],
        path: `/chapter/${mockId}`,
        query: undefined,
        data: [
          {
            _id: '6091b6d6d58360f988133b8b',
            chapterName: 'A Long-expected Party',
            book: '5cf5805fb53e011a64671582',
          },
        ],
      },
      {
        name: 'getBooks',
        method: SDK.getBooks,
        args: [],
        path: `/book`,
        query: { page: '1' },
        data: [
          {
            _id: '5cf5805fb53e011a64671582',
            name: 'The Fellowship Of The Ring',
          },
          {
            _id: '5cf58077b53e011a64671583',
            name: 'The Two Towers',
          },
          {
            _id: '5cf58080b53e011a64671584',
            name: 'The Return Of The King',
          },
        ],
      },
      {
        name: 'getBookChapters',
        method: SDK.getBookChapters,
        args: [mockId],
        path: `/book/${mockId}/chapter`,
        query: { page: '1' },
        data: [
          {
            _id: '6091b6d6d58360f988133b8b',
            chapterName: 'A Long-expected Party',
          },
          {
            _id: '6091b6d6d58360f988133b8c',
            chapterName: 'The Shadow of the Past',
          },
          {
            _id: '6091b6d6d58360f988133b8d',
            chapterName: 'Three is Company',
          },
        ],
      },
      {
        name: 'getMovies',
        method: SDK.getMovies,
        args: [],
        path: `/movie`,
        query: { page: '1' },
        data: [
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
        ],
      },
      {
        name: 'getMovieQuotes',
        method: SDK.getMovieQuotes,
        args: [mockId],
        path: `/movie/${mockId}/quote`,
        query: { page: '1' },
        data: [
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
        ],
      },
      {
        name: 'getCharacters',
        method: SDK.getCharacters,
        args: [],
        path: `/character`,
        query: { page: '1' },
        data: [
          {
            _id: '5cd99d4bde30eff6ebccfbbe',
            height: '',
            race: 'Human',
            gender: 'Female',
            birth: '',
            spouse: 'Belemir',
            death: '',
            realm: '',
            hair: '',
            name: 'Adanel',
            wikiUrl: 'http://lotr.wikia.com//wiki/Adanel',
          },
          {
            _id: '5cd99d4bde30eff6ebccfbbf',
            height: '',
            race: 'Human',
            gender: 'Male',
            birth: 'Before ,TA 1944',
            spouse: '',
            death: 'Late ,Third Age',
            realm: '',
            hair: '',
            name: 'Adrahil I',
            wikiUrl: 'http://lotr.wikia.com//wiki/Adrahil_I',
          },
          {
            _id: '5cd99d4bde30eff6ebccfbc0',
            height: '',
            race: 'Human',
            gender: 'Male',
            birth: 'TA 2917',
            spouse: 'Unnamed wife',
            death: 'TA 3010',
            realm: '',
            hair: '',
            name: 'Adrahil II',
            wikiUrl: 'http://lotr.wikia.com//wiki/Adrahil_II',
          },
        ],
      },
      {
        name: 'getCharacterQuotes',
        method: SDK.getCharacterQuotes,
        args: [mockId],
        path: `/character/${mockId}/quote`,
        query: { page: '1' },
        data: [
          {
            _id: '5cd96e05de30eff6ebcce80b',
            dialog: 'Now come the days of the King. May they be blessed.',
            movie: '5cd95395de30eff6ebccde5d',
            character: '5cd99d4bde30eff6ebccfea0',
            id: '5cd96e05de30eff6ebcce80b',
          },
          {
            _id: '5cd96e05de30eff6ebcce82a',
            dialog: 'Hobbits!',
            movie: '5cd95395de30eff6ebccde5d',
            character: '5cd99d4bde30eff6ebccfea0',
            id: '5cd96e05de30eff6ebcce82a',
          },
          {
            _id: '5cd96e05de30eff6ebcce832',
            dialog: 'Be careful. Even in defeat, Saruman is dangerous.',
            movie: '5cd95395de30eff6ebccde5d',
            character: '5cd99d4bde30eff6ebccfea0',
            id: '5cd96e05de30eff6ebcce832',
          },
        ],
      },
      {
        name: 'getQuotes',
        method: SDK.getQuotes,
        args: [],
        path: `/quote`,
        query: { page: '1' },
        data: [
          {
            _id: '5cd96e05de30eff6ebcce7e9',
            dialog: 'Deagol!',
            movie: '5cd95395de30eff6ebccde5d',
            character: '5cd99d4bde30eff6ebccfe9e',
            id: '5cd96e05de30eff6ebcce7e9',
          },
          {
            _id: '5cd96e05de30eff6ebcce7ea',
            dialog: 'Deagol!',
            movie: '5cd95395de30eff6ebccde5d',
            character: '5cd99d4bde30eff6ebccfe9e',
            id: '5cd96e05de30eff6ebcce7ea',
          },
          {
            _id: '5cd96e05de30eff6ebcce7eb',
            dialog: 'Deagol!',
            movie: '5cd95395de30eff6ebccde5d',
            character: '5cd99d4bde30eff6ebccfe9e',
            id: '5cd96e05de30eff6ebcce7eb',
          },
        ],
      },
      {
        name: 'getChapters',
        method: SDK.getChapters,
        args: [],
        path: `/chapter`,
        query: { page: '1' },
        data: [
          {
            _id: '6091b6d6d58360f988133b8b',
            chapterName: 'A Long-expected Party',
            book: '5cf5805fb53e011a64671582',
          },
          {
            _id: '6091b6d6d58360f988133b8c',
            chapterName: 'The Shadow of the Past',
            book: '5cf5805fb53e011a64671582',
          },
          {
            _id: '6091b6d6d58360f988133b8d',
            chapterName: 'Three is Company',
            book: '5cf5805fb53e011a64671582',
          },
        ],
      },
    ];

    for (const methodConfig of methodMap) {
      it(`${methodConfig.name} should reject with OSNAuthError if Authorization header is invalid`, async () => {
        const nockBase = nock(BASE_URL, {
          reqheaders: {
            authorization: `Bearer ${mockToken}`,
          },
        }).get(methodConfig.path);
        if (methodConfig.query) nockBase.query(methodConfig.query);
        nockBase.reply(401);

        await expect(methodConfig.method(methodConfig.args[0])).to.be.rejectedWith(OSNAuthError);
      });
      it(`${methodConfig.name} should reject with OSNRateLimitError if rate limit is exceeded`, async () => {
        const nockBase = nock(BASE_URL).get(methodConfig.path);
        if (methodConfig.query) nockBase.query(methodConfig.query);
        nockBase.reply(429);

        await expect(methodConfig.method(methodConfig.args[0])).to.be.rejectedWith(
          OSNRateLimitError
        );
      });
      it(`${methodConfig.name} should reject with OSNError if an unspecified Axios error occurs`, async () => {
        const nockBase = nock(BASE_URL).get(methodConfig.path);
        if (methodConfig.query) nockBase.query(methodConfig.query);
        nockBase.reply(555);

        await expect(methodConfig.method(methodConfig.args[0])).to.be.rejectedWith(OSNError);
      });
      it(`${methodConfig.name} should reject with bubbled error if an unspecified non-Axios error occurs`, async () => {
        const nockBase = nock(BASE_URL).get(methodConfig.path);
        if (methodConfig.query) nockBase.query(methodConfig.query);
        nockBase.replyWithError({ message: 'Something really bad happened', code: 'BAD' });

        await expect(methodConfig.method(methodConfig.args[0]))
          .to.eventually.be.rejected.and.be.an.instanceOf(Error)
          .and.have.property('code', 'BAD');
      });

      if (methodConfig.data.length > 1) {
        // Paginated tests
        it(`${methodConfig.name} should resolve with paginated items page by page through next method`, async () => {
          const mockItems = methodConfig.data;

          // Mock first page with single result
          nock(BASE_URL)
            .get(methodConfig.path)
            .query({ page: '1' })
            .reply(200, {
              docs: [mockItems[0]],
              total: 3,
              limit: 1,
              page: 1,
              pages: 3,
            });

          const resultPage1 = (await methodConfig.method(
            methodConfig.args[0]
          )) as PaginatedResponse<any>;

          expect(resultPage1.items).to.eql([mockItems[0]]);
          expect(resultPage1.hasNext).to.eql(true);

          // Mock second and third pages
          nock(BASE_URL)
            .get(methodConfig.path)
            .query({ page: '2' })
            .reply(200, {
              docs: [mockItems[1]],
              total: 3,
              limit: 1,
              page: 2,
              pages: 3,
            });
          nock(BASE_URL)
            .get(methodConfig.path)
            .query({ page: '3' })
            .reply(200, {
              docs: [mockItems[2]],
              total: 3,
              limit: 1,
              page: 3,
              pages: 3,
            });

          const resultPage2 = await resultPage1.next();

          expect(resultPage2.items).to.eql([mockItems[1]]);
          expect(resultPage2.hasNext).to.eql(true);

          const resultPage3 = await resultPage2.next();

          expect(resultPage3.items).to.eql([mockItems[2]]);
          expect(resultPage3.hasNext).to.eql(false);
        });
      } else {
        // Single item tests
        it(`${methodConfig.name} should resolve with single item`, async () => {
          const mockItem = methodConfig.data[0];

          nock(BASE_URL)
            .get(methodConfig.path)
            .reply(200, {
              docs: [mockItem],
              total: 1,
              limit: 1000,
              offset: 0,
              page: 1,
              pages: 1,
            });

          const result = await methodConfig.method(methodConfig.args[0]);

          expect(result).to.eql(mockItem);
        });
      }
    }
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
