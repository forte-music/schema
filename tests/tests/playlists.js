import { print } from 'graphql/language/printer';
import client from '../client';
import query from './playlist.graphql';

it('should resolve a query for data stemming from a playlist', async () => {
  const resp = await client.request(print(query));
  expect(resp).toMatchSnapshot();
});
