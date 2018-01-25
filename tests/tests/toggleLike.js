import client from '../client';

it('should toggle the liked status of a song', async () => {
  const variables = { songId: 'song:1:1' };

  const { song: { stats: { id: queryId, liked } } } = await client.request(
    `
      query($songId: ID!) {
        song(id: $songId) {
          id

          stats {
            id
            liked
          }
        }
      }
    `,
    variables
  );

  const expected = !liked;

  const {
    toggleLike: { id: mutationId, liked: actual },
  } = await client.request(
    `
      mutation($songId: ID!) {
        toggleLike(songId: $songId) {
          id
          liked
        }
      }
    `,
    variables
  );

  expect(actual).toBe(expected);
  expect(queryId).toBe(mutationId);
});
