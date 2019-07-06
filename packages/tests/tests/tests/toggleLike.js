import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import client from '../client';
import { uuidForNum } from '../utils';

it('should toggle the liked status of a song', async () => {
  const variables = { songId: uuidForNum(1) };

  const { song: fromQuery } = await client.request(
    print(gql`
      query($songId: ID!) {
        song(id: $songId) {
          id
          liked
        }
      }
    `),
    variables
  );

  const { toggleLike: fromMutation } = await client.request(
    print(gql`
      mutation($songId: ID!) {
        toggleLike(songId: $songId) {
          id
          liked
        }
      }
    `),
    variables
  );

  expect(fromMutation).toMatchObject({
    ...fromQuery,
    liked: !fromQuery.liked,
  });
});
