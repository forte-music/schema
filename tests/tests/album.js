import client from '../client';

it('should calculate the duration for an album', async () => {
  const variables = { albumId: 'album:4' };

  const { album } = await client.request(
    `
      query($albumId: ID!) {
        album(id: $albumId) {
          id
          duration
        }
      }
    `,
    variables,
  );

  expect(album).toMatchObject({
    id: variables.albumId,
    duration: 74 * 60 + 22,
  });
});

