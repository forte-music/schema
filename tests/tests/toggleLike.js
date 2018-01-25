import client from '../client';

it('should toggle the liked status of a song', async () => {
  const variables = { songId: 'song:1:1' };

  const { song: { stats: queryStats } } = await client.request(
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

  const {
    toggleLike: mutationStats
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

  expect(mutationStats).toMatchObject({
    ...queryStats,
    liked: !queryStats.liked,
  });
});
