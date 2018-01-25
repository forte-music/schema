import client from '../client';

it('should update the time a song was last played at', async () => {
  const variables = { songId: 'song:1:1' };
  const { song: { stats: queryStats } } = await client.request(
    `
      query($songId: ID!) {
        song(id: $songId) {
          id

          stats {
            id
            playCount
            lastPlayed
          }
        }
      }
    `,
    variables,
  );

  const { playSong: mutationStats } = await client.request(
    `
      mutation($songId: ID!) {
        playSong(songId: $songId) {
          id
          playCount
          lastPlayed
        }
      }
    `,
    variables,
  );

  expect(mutationStats).toMatchObject({
    id: queryStats.id,
    playCount: queryStats.playCount + 1,
  });
  expect(mutationStats.lastPlayed).toBeGreaterThan(queryStats.lastPlayed);
});

