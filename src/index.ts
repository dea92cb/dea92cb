import { URLSearchParams } from 'url';
import fetch from 'cross-fetch';
import { Book, Chapter, Character, Movie, Quote } from './models';

export interface PaginationOptions {
  pagination?: {
    limit?: number;
    page?: number;
    offset?: number;
  };
}

export interface SortOptions<T> {
  sort?: {
    direction: 'asc' | 'desc';
    key: Extract<keyof T, string>;
  };
}

export type ListQueryOptions<T> = PaginationOptions & SortOptions<T> & FilterOptions

export interface FilterOptions {
  additionalOptions?: string;
}

export class LotrClient {
  public book = {
    list: (options?: ListQueryOptions<Book>) => this.get<Book, Book[]>('/book', options),
    get: (id: string) => this.get<Book, Book>(`/book/${id}`),
    listChapters: (id: string, options: ListQueryOptions<Chapter>) => this.get<Chapter, Chapter[]>(`/book/${id}/chapter`, options),
  };
  public movie = {
    list: (options?: ListQueryOptions<Movie>) => this.get<Movie, Movie[]>('/movie', options),
    get: (id: string) => this.get<Movie, Movie>(`/movie/${id}`),
    listQuotes: (id: string, options: ListQueryOptions<Quote>) => this.get<Quote, Quote[]>(`/movie/${id}/quotes`, options),
  };
  public character = {
    list: (options?: ListQueryOptions<Character>) => this.get<Character, Character[]>('/character', options),
    get: (id: string) => this.get<Character, Character>(`/character/${id}`),
    listQuotes: (id: string, options: ListQueryOptions<Quote>) => this.get<Quote, Quote[]>(`/character/${id}/quote`, options),
  };
  public quote = {
    list: (options?: ListQueryOptions<Quote>) => this.get<Quote, Quote[]>('/quote', options),
    get: (id: string) => this.get<Quote, Quote>(`/quote/${id}`),
  };
  public chapter = {
    list: (options?: ListQueryOptions<Chapter>) => this.get<Chapter, Chapter[]>('/chapter', options),
    get: (id: string) => this.get<Chapter, Chapter>(`/chapter/${id}`),
  };
  constructor(private options: {apiKey: string}) {
  }
  private constructQuery<T>(options: ListQueryOptions<T>): string {
    const searchParams = new URLSearchParams();

    if (options.pagination) {
      Object.entries(options.pagination).forEach(([option, value]) => searchParams.set(option, String(value)));
    }

    if (options.sort) {
      searchParams.set('sort', `${options.sort.key}:${options.sort.direction}`);
    }

    let qs = searchParams.toString();

    if (options.additionalOptions) {
      qs += '&' + options.additionalOptions;
    }

    return qs;
  }

  private async get<T, R>(path: string, options: ListQueryOptions<T> = {}): Promise<R> {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${this.options.apiKey}`,
    };
    const query = this.constructQuery(options);
    const rawData = await fetch(`https://the-one-api.dev/v2/${path}${query}`, {
      headers: headers,
    });
    return rawData.json();
  }
}