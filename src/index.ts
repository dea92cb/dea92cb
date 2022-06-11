import { URLSearchParams } from 'url';
import fetch from 'cross-fetch';
import { Book, BookChapter, Chapter, Character, Movie, Quote } from './models';

async function retryLoop<T>(
  pF: () => Promise<T>,
  number: number,
  failMessage: string,
): Promise<T> {
  let e: any;
  for (let i = 0; i < number; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await pF();
      if (result) {
        return result;
      }
    } catch (err) {
      e = err;
      await new Promise(resolve => setTimeout(resolve, 50 ** (2 * i) + 50 ** (2*i) * Math.random()));
    }
  }
  if (e) {
    throw new Error(`${failMessage}: ${e.toString()}`);
  }
  throw new Error(failMessage);
}

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
    list: (options?: ListQueryOptions<Book>) => this.getList<Book>('/book', options),
    get: (id: string) => this.get<Book>(`/book/${id}`),
    listChapters: (id: string, options?: ListQueryOptions<BookChapter>) => this.getList<BookChapter>(`/book/${id}/chapter`, options),
  };
  public movie = {
    list: (options?: ListQueryOptions<Movie>) => this.getList<Movie>('/movie', options),
    get: (id: string) => this.get<Movie>(`/movie/${id}`),
    listQuotes: (id: string, options?: ListQueryOptions<Quote>) => this.getList<Quote>(`/movie/${id}/quote`, options),
  };
  public character = {
    list: (options?: ListQueryOptions<Character>) => this.getList<Character>('/character', options),
    get: (id: string) => this.get<Character>(`/character/${id}`),
    listQuotes: (id: string, options?: ListQueryOptions<Quote>) => this.getList<Quote>(`/character/${id}/quote`, options),
  };
  public quote = {
    list: (options?: ListQueryOptions<Quote>) => this.getList<Quote>('/quote', options),
    get: (id: string) => this.get<Quote>(`/quote/${id}`),
  };
  public chapter = {
    list: (options?: ListQueryOptions<Chapter>) => this.getList<Chapter>('/chapter', options),
    get: (id: string) => this.get<Chapter>(`/chapter/${id}`),
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

    if (qs) {
      qs = '?' + qs;
    }

    return qs;
  }

  private async getList<T>(path: string, options: ListQueryOptions<T> = {}): Promise<T[]> {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${this.options.apiKey}`,
    };
    const query = this.constructQuery(options);
    const fullPath = `https://the-one-api.dev/v2/${path}${query}`;
    const rawData = await fetch(fullPath, {
      headers: headers,
    });

    const rawResponse = await retryLoop(() => rawData.json(), 5, `couldn't get JSON from ${fullPath}. Response was ${rawData.status} ${rawData.statusText}`);

    const responseItems = rawResponse.docs;
    if (!Array.isArray(responseItems)) {
      throw new Error(`unexpected response from ${fullPath}: ${JSON.stringify(rawResponse)}. Expected docs array`);
    }
    return responseItems;
  }

  private async get<T>(path: string): Promise<T> {
    const items = await this.getList<T>(path);
    if (items.length !== 1) {
      throw new Error(`could not find single item with ID ${path}`);
    }
    return items[0];
  }

}