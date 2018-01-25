import client from '../client';

it('should get the artists of a song', async () => {
  const variables = { songId: 'song:2:1' };
  const { song } = await client.request(
    `
      query($songId: ID!) {
        song(id: $songId) {
          id
          name

          artists {
            id
            name
          }
        }
      }
    `,
    variables
  );

  expect(song.artists.length).toBeGreaterThan(0);
});

it('should get all items when limit is -1', async () => {
  const { songs } = await client.request(
    `
      query {
        songs(input: { limit: -1 }) {
          count
          edges {
            cursor
            node {
              id
            }
          }
        }
      }
    `
  );

  expect(songs.count).toEqual(songs.edges.length);
});
