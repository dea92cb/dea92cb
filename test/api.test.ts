import { LotrClient } from '../src';

const apiKey = process.env.LOTR_API_KEY ?? '';

describe('list options', () => {
  test('no options', async () => {
    const client = new LotrClient({ apiKey });
    expect(await client.book.list()).toMatchSnapshot();
  });
  test('limit=1 + sorting', async () => {
    const client = new LotrClient({ apiKey });
    const result = await client.book.list({
      pagination: { limit: 1 },
      sort: {
        key: 'name',
        direction: 'asc',
      },
    });
    expect(result).toMatchObject([{
      name: 'The Fellowship Of The Ring',
    }]);
    expect(result).toHaveLength(1);

    expect(await client.book.list({
      pagination: { limit: 1 },
      sort: {
        key: 'name',
        direction: 'desc',
      },
    })).toMatchObject([{
      name: 'The Two Towers',
    }]);
  });

  test('limit=1 + filter', async () => {
    const client = new LotrClient({ apiKey });
    const result = await client.book.list({
      pagination: { limit: 1 },
      additionalOptions: 'name=/King/',
    });
    expect(result).toHaveLength(1);
    expect(result).toMatchObject([{
      name: 'The Return Of The King',
    }]);
  });

  test('look up chapter by id', async () => {
    const client = new LotrClient({ apiKey });
    expect(await client.book.listChapters('5cf5805fb53e011a64671582')).toMatchSnapshot();
  });
});

const apis: ('book' | 'movie' | 'character' | 'quote' | 'chapter')[] =['book', 'movie', 'character', 'quote', 'chapter'];

apis.forEach((key) => {
  describe(key, () => {
    const client = new LotrClient({ apiKey });
    test('list snapshot', async () => {
      expect(await client[key].list()).toMatchSnapshot();
    });
    test('get / list results equivalent', async () => {
      const results = await client[key].list();
      expect(results.length >= 1).toBeTruthy();
      const id = results[0]._id;
      expect(await client[key].get(id)).toMatchObject(results[0]);
    });
    if ('listQuotes' in client[key]) {
      test('can list quotes', async () => {
        const results = await client[key].list();
        expect(results.length >= 1).toBeTruthy();
        const id = results[0]._id;
        expect(await (client[key] as any).listQuotes(id)).toMatchSnapshot();
      });
    }
  });
});