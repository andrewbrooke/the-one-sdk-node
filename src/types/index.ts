export type APIResponse<T> = {
  docs: T[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
};

export type PaginatedParameters = {
  limit?: number;
  page?: number;
  sort?: string;
  filter?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  hasNext: boolean;
  next(): Promise<PaginatedResponse<T>>;
};

export type Movie = {
  _id: string;
  name: string;
  runtimeInMinutes: number;
  budgetInMillions: number;
  boxOfficeRevenueInMillions: number;
  academyAwardNominations: number;
  academyAwardWins: number;
  rottenTomatoesScore: number;
};

export type MovieQuote = {
  _id: string;
  dialog: string;
  movie: string;
  character: string;
  id: string;
};
