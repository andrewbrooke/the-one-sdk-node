import axios from 'axios';
import _ from 'lodash';

import {
  APIResponse,
  Movie,
  Quote,
  Book,
  Chapter,
  Character,
  PaginatedParameters,
  PaginatedResponse,
} from './types';
import { handleAxiosError } from './helpers/error';

export { Movie, Quote, Book, Chapter, Character, PaginatedParameters, PaginatedResponse };

export default class OneSDK {
  protected Axios;

  constructor({ token }: { token: string }) {
    this.Axios = axios.create({
      baseURL: 'https://the-one-api.dev/v2',
    });

    this.Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    this.Axios.interceptors.response.use(response => {
      return response.data;
    });
  }

  private async handleSingleRequest<T>(path: string, id: string): Promise<T> {
    try {
      const response: APIResponse<T> = await this.Axios.get(`${path}/${id}`);

      return response.docs[0];
    } catch (err) {
      throw handleAxiosError(err);
    }
  }

  private async handlePaginatedRequest<T>(
    path: string,
    pParams?: PaginatedParameters
  ): Promise<PaginatedResponse<T>> {
    // Set / extend default parameters
    const params = {
      page: 1,
      ...pParams,
    };

    try {
      // Set filter parameter (non-standard query string) and attach all other params to query
      const response: APIResponse<T> = await this.Axios.get(
        `${path}${params.filter ? `?${params.filter}` : ''}`,
        {
          params: _.omit(params, 'filter'),
        }
      );

      return {
        items: response.docs,
        hasNext: response.page < response.pages,
        next: async () =>
          await this.handlePaginatedRequest(path, {
            ...params,
            page: response.page + 1,
          }),
      };
    } catch (err) {
      throw handleAxiosError(err);
    }
  }

  /**
   * Get a specific book by its ID
   *
   * @async
   * @param {string} id
   * @returns {Promise<Book>}
   */
  public getBook = async (id: string): Promise<Book> => {
    return this.handleSingleRequest('/book', id);
  };

  /**
   * Get a specific movie by its ID
   *
   * @async
   * @param {string} id
   * @returns {Promise<Movie>}
   */
  public getMovie = async (id: string): Promise<Movie> => {
    return this.handleSingleRequest('/movie', id);
  };

  /**
   * Get a specific character by its ID
   *
   * @async
   * @param {string} id
   * @returns {Promise<Character>}
   */
  public getCharacter = async (id: string): Promise<Character> => {
    return this.handleSingleRequest('/character', id);
  };

  /**
   * Get a specific quote by its ID
   *
   * @async
   * @param {string} id
   * @returns {Promise<Quote>}
   */
  public getQuote = async (id: string): Promise<Quote> => {
    return this.handleSingleRequest('/quote', id);
  };

  /**
   * Get a specific chapter by its ID
   *
   * @async
   * @param {string} id
   * @returns {Promise<Chapter>}
   */
  public getChapter = async (id: string): Promise<Chapter> => {
    return this.handleSingleRequest('/chapter', id);
  };

  /**
   * Get list of books from provided filtering parameters
   *
   * @async
   * @param {?PaginatedParameters} params
   * @returns {Promise<PaginatedResponse<Book>>}
   */
  public getBooks = async (params?: PaginatedParameters): Promise<PaginatedResponse<Book>> => {
    return this.handlePaginatedRequest<Book>(`/book`, params);
  };

  /**
   * Get list of book chapters by the book ID from provided filtering parameters
   *
   * @async
   * @param {string} id
   * @param {?PaginatedParameters} params
   * @returns {Promise<PaginatedResponse<Chapter>>}
   */
  public getBookChapters = async (
    id: string,
    params?: PaginatedParameters
  ): Promise<PaginatedResponse<Chapter>> => {
    return this.handlePaginatedRequest<Chapter>(`/book/${id}/chapter`, params);
  };

  /**
   * Get list of movies from provided filtering parameters
   *
   * @async
   * @param {?PaginatedParameters} params
   * @returns {Promise<PaginatedResponse<Movie>>}
   */
  public getMovies = async (params?: PaginatedParameters): Promise<PaginatedResponse<Movie>> => {
    return this.handlePaginatedRequest<Movie>(`/movie`, params);
  };

  /**
   * Get list of movie quotes by the movie ID from provided filtering parameters
   *
   * @async
   * @param {string} id
   * @param {?PaginatedParameters} params
   * @returns {Promise<PaginatedResponse<Quote>>}
   */
  public getMovieQuotes = async (
    id: string,
    params?: PaginatedParameters
  ): Promise<PaginatedResponse<Quote>> => {
    return this.handlePaginatedRequest<Quote>(`/movie/${id}/quote`, params);
  };

  /**
   * Get list of characters from provided filtering parameters
   *
   * @async
   * @param {?PaginatedParameters} params
   * @returns {Promise<PaginatedResponse<Character>>}
   */
  public getCharacters = async (
    params?: PaginatedParameters
  ): Promise<PaginatedResponse<Character>> => {
    return this.handlePaginatedRequest<Character>(`/character`, params);
  };

  /**
   * Get list of character quotes by the character ID from provided filtering parameters
   *
   * @async
   * @param {string} id
   * @param {?PaginatedParameters} params
   * @returns {Promise<PaginatedResponse<Quote>>}
   */
  public getCharacterQuotes = async (
    id: string,
    params?: PaginatedParameters
  ): Promise<PaginatedResponse<Quote>> => {
    return this.handlePaginatedRequest<Quote>(`/character/${id}/quote`, params);
  };

  /**
   * Get list of quotes from provided filtering parameters
   *
   * @async
   * @param {?PaginatedParameters} params
   * @returns {Promise<PaginatedResponse<Quote>>}
   */
  public getQuotes = async (params?: PaginatedParameters): Promise<PaginatedResponse<Quote>> => {
    return this.handlePaginatedRequest<Quote>(`/quote`, params);
  };

  /**
   * Get list of chapters from provided filtering parameters
   *
   * @async
   * @param {?PaginatedParameters} params
   * @returns {Promise<PaginatedResponse<Chapter>>}
   */
  public getChapters = async (
    params?: PaginatedParameters
  ): Promise<PaginatedResponse<Chapter>> => {
    return this.handlePaginatedRequest<Chapter>(`/chapter`, params);
  };
}
