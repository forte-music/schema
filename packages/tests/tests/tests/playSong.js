import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import client from '../client';

import { uuidForNum } from '../utils';

// Checks whether the play count has increased by one and whether the lastPlayed
// time has been updated.
const expectPlayCountUpdated = (oldPlayCount, newPlayCount) => {
  expect(newPlayCount).toBe(oldPlayCount + 1);
};

const expectPlayTimeUpdated = (oldPlayTime, newPlayTime) => {
  expect(newPlayTime).toBeGreaterThan(oldPlayTime || 0);
};

it('should update song play count', async () => {
  const query = gql`
    query($songId: ID!) {
      song(id: $songId) {
        lastPlayed
        playCount
      }
    }
  `;

  const mutation = gql`
    mutation($songId: ID!) {
      trackPlaySong(songId: $songId) {
        playCount
        lastPlayed
      }
    }
  `;

  const { song: querySong } = await client.request(print(query), {
    songId: uuidForNum(1),
  });

  const { trackPlaySong: mutationSong } = await client.request(
    print(mutation),
    {
      songId: uuidForNum(1),
    }
  );

  expectPlayTimeUpdated(querySong.lastPlayed, mutationSong.lastPlayed);
  expectPlayCountUpdated(querySong.playCount, mutationSong.playCount);
});

it('should update artist play time', async () => {
  const localVariables = {
    songId: uuidForNum(1),
    artistId: uuidForNum(1),
  };

  const query = gql`
    query($songId: ID!, $artistId: ID!) {
      song(id: $songId) {
        playCount
        lastPlayed
      }

      artist(id: $artistId) {
        lastPlayed
      }
    }
  `;

  const mutation = gql`
    mutation($songId: ID!, $artistId: ID!) {
      trackPlaySongFromArtist(songId: $songId, artistId: $artistId) {
        song {
          playCount
          lastPlayed
        }

        artist {
          lastPlayed
        }
      }
    }
  `;

  const fromQuery = await client.request(print(query), localVariables);

  const { trackPlaySongFromArtist: fromMutation } = await client.request(
    print(mutation),
    localVariables
  );

  expectPlayCountUpdated(fromQuery.song.playCount, fromMutation.song.playCount);
  expectPlayTimeUpdated(
    fromQuery.artist.lastPlayed,
    fromMutation.artist.lastPlayed
  );
});

it('should update album play time', async () => {
  const localVariables = {
    songId: uuidForNum(1),
    albumId: uuidForNum(1),
  };

  const query = gql`
    query($songId: ID!, $albumId: ID!) {
      song(id: $songId) {
        playCount
        lastPlayed
      }

      album(id: $albumId) {
        lastPlayed
      }
    }
  `;

  const mutation = gql`
    mutation($songId: ID!, $albumId: ID!) {
      trackPlaySongFromAlbum(songId: $songId, albumId: $albumId) {
        song {
          playCount
          lastPlayed
        }

        album {
          lastPlayed
        }
      }
    }
  `;

  const fromQuery = await client.request(print(query), localVariables);

  const { trackPlaySongFromAlbum: fromMutation } = await client.request(
    print(mutation),
    localVariables
  );

  expectPlayCountUpdated(fromQuery.song.playCount, fromMutation.song.playCount);
  expectPlayTimeUpdated(
    fromQuery.album.lastPlayed,
    fromMutation.album.lastPlayed
  );
});
