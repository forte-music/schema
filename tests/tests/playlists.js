import client from '../client';
import query from './playlist.graphql';

it('should resolve a query for data stemming from a playlist', async () => {
  const resp = await client.request(query);
  expect(resp).toMatchSnapshot();
});
