import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import client from '../client';
import { uuidForNum } from '../utils';

it('should toggle the liked status of a song', async () => {
  const variables = { songId: uuidForNum(1) };

  const { song: { songStats: queryStats } } = await client.request(
    print(gql`
      query($songId: ID!) {
        song(id: $songId) {
          id

          songStats {
            id
            liked
          }
        }
      }
    `),
    variables
  );

  const { toggleLike: { songStats: mutationStats } } = await client.request(
    print(gql`
      mutation($songId: ID!) {
        toggleLike(songId: $songId) {
          songStats {
            id
            liked
          }
        }
      }
    `),
    variables
  );

  expect(mutationStats).toMatchObject({
    ...queryStats,
    liked: !queryStats.liked,
  });
});
