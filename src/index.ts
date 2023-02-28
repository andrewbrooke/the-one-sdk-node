import axios from 'axios';
import _ from 'lodash';

import { APIResponse, Movie, MovieQuote, PaginatedParameters, PaginatedResponse } from './types';
import { handleAxiosError } from './helpers/error';

export { Movie, MovieQuote, PaginatedParameters, PaginatedResponse };

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

  /**
   * Get a specific movie by its ID
   *
   * @async
   * @param {string} id
   * @returns {Promise<Movie>}
   */
  public getMovie = async (id: string): Promise<Movie> => {
    try {
      const response: APIResponse<Movie> = await this.Axios.get(`/movie/${id}`);

      return response.docs[0];
    } catch (err) {
      throw handleAxiosError(err);
    }
  };

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
   * @returns {Promise<PaginatedResponse<MovieQuote>>}
   */
  public getMovieQuotes = async (
    id: string,
    params?: PaginatedParameters
  ): Promise<PaginatedResponse<MovieQuote>> => {
    return this.handlePaginatedRequest<MovieQuote>(`/movie/${id}/quote`, params);
  };
}
