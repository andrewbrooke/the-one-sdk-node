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

export type Quote = {
  _id: string;
  dialog: string;
  movie: string;
  character: string;
  id: string;
};

export type Book = {
  _id: string;
  name: string;
};

export type Chapter = {
  _id: string;
  chapterName: string;
};

export type Character = {
  _id: string;
  height: string;
  race: string;
  gender: string;
  birth: string;
  spouse: string;
  death: string;
  realm: string;
  hair: string;
  name: string;
  wikiUrl: string;
};
