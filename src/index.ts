import axios from 'axios';
import _ from 'lodash';

import { APIResponse, Movie, MovieQuote, PaginatedParameters, PaginatedResponse } from './types';
import { handleAxiosError } from './helpers/error';

export default class OneSDK {
  private Axios;

  constructor({ token }: { token: string }) {
    this.Axios = axios.create({
      baseURL: 'https://the-one-api.dev/v2',
    });

    this.Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    this.Axios.interceptors.response.use(response => {
      return response.data;
    });
  }

  public getMovie = async (id: string): Promise<Movie> => {
    try {
      const response: APIResponse<Movie> = await this.Axios.get(`/movie/${id}`);

      return response.docs[0];
    } catch (err) {
      throw handleAxiosError(err);
    }
  };

  public getMovies = async (params?: PaginatedParameters): Promise<PaginatedResponse<Movie>> => {
    try {
      const response: APIResponse<Movie> = await this.Axios.get(
        `/movie${params?.filter ? `?${params.filter}` : ''}`,
        {
          params: _.omit(params, 'filter'),
        }
      );

      return {
        items: response.docs,
        hasNext: response.page < response.pages,
        next: async () =>
          await this.getMovies({
            ...params,
            page: response.page + 1,
          }),
      };
    } catch (err) {
      throw handleAxiosError(err);
    }
  };

  public getMovieQuotes = async (
    id: string,
    params?: PaginatedParameters
  ): Promise<PaginatedResponse<MovieQuote>> => {
    try {
      const response: APIResponse<MovieQuote> = await this.Axios.get(
        `/movie/${id}/${params?.filter ? `?${params.filter}` : ''}`,
        {
          params: _.omit(params, 'filter'),
        }
      );

      return {
        items: response.docs,
        hasNext: response.page < response.pages,
        next: async () =>
          await this.getMovieQuotes(id, {
            ...params,
            page: response.page + 1,
          }),
      };
    } catch (err) {
      throw handleAxiosError(err);
    }
  };
}
