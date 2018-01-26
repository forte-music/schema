import client from '../client';
import { ClientError } from 'graphql-request';

const mutation = `
  mutation($songId: ID!, $artistId: ID, $albumId: ID, $playlistId: ID) {
    playSong(
      songId: $songId
      artistId: $artistId
      albumId: $albumId
      playlistId: $playlistId
    ) {
      id
      playCount
      lastPlayed
    }
  }
`;

async function checkPlaySong(variables) {
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
    variables
  );

  const { playSong: mutationStats } = await client.request(mutation, variables);

  expect(mutationStats).toMatchObject({
    id: queryStats.id,
    playCount: queryStats.playCount + 1,
  });
  expect(mutationStats.lastPlayed).toBeGreaterThan(queryStats.lastPlayed);
}

const variables = { songId: 'song:1:1' };
it('should update song user stats', () => checkPlaySong(variables));

// TODO: Should Check Play Stats of Artist When Implemented
it('should update song user stats when called with a valid specified artist', () =>
  checkPlaySong({ ...variables, artistId: 'artist:1' }));

// TODO: Should Check Play Stats of Album When Implemented
it('should update song user stats when called with a valid specified album', () =>
  checkPlaySong({ ...variables, albumId: 'album:1' }));

// TODO: Should Check Play Stats of Playlist When Implemented
it('should update song user stats when called was with a valid specified playlist', () =>
  checkPlaySong({ ...variables, albumId: 'playlist:2' }));

it('should fail when called with more than one descriptor', async () =>
  expect(
    client.request(mutation, {
      ...variables,
      artistId: 'artist:1',
      albumId: 'album:1',
      playlistId: 'playlist:2',
    })
  ).rejects.toThrow(ClientError));
