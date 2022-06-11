import { LotrClient } from '../src';

test('look up book list', async () => {
  const client = new LotrClient({ apiKey: '' });
  expect(await client.book.list()).toMatchSnapshot();
});

test('look up book by id', async () => {
  const client = new LotrClient({ apiKey: '' });
  expect(await client.book.get('5cf5805fb53e011a64671582')).toMatchSnapshot();
});