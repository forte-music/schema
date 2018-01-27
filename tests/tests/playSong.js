import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import client from '../client';
import { ClientError } from 'graphql-request';

import UserStatsFields from './fragments/UserStatsFields.graphql';
import SongUserStatsField from './fragments/SongUserStatsFields.graphql';

const variables = { songId: 'song:1:1' };

const mutation = print(gql`
  mutation($songId: ID!, $artistId: ID, $albumId: ID, $playlistId: ID) {
    playSong(
      songId: $songId
      artistId: $artistId
      albumId: $albumId
      playlistId: $playlistId
    ) {
      albumStats {
        ...UserStatsFields
      }

      artistStats {
        ...UserStatsFields
      }

      playlistStats {
        ...UserStatsFields
      }

      songStats {
        ...SongUserStatsFields
        stats {
          ...UserStatsFields
        }
      }
    }
  }

  ${UserStatsFields}
  ${SongUserStatsField}
`);

// Checks whether the play count has increased by one and whether the
// lastPlayed time has been updated.
const expectPlayCountUpdated = (queryStats, mutationStats) => {
  expect(mutationStats).toMatchObject({
    id: queryStats.id,
    playCount: queryStats.playCount + 1,
  });
  expect(mutationStats.lastPlayed).toBeGreaterThan(queryStats.lastPlayed);
};

it('should update song play count', async () => {
  const query = gql`
    query($songId: ID!) {
      song(id: $songId) {
        stats {
          stats {
            ...UserStatsFields
          }
        }
      }
    }

    ${UserStatsFields}
  `;

  const { song: { stats: { stats: queryStats } } } = await client.request(
    print(query),
    variables
  );

  const {
    playSong: { songStats: { stats: mutationStats } },
  } = await client.request(mutation, variables);

  expectPlayCountUpdated(queryStats, mutationStats);
});

it('should update artist play count', async () => {
  const variables = { ...variables, artistId: 'artist:1' };

  const query = gql`
    query($artistId: ID!) {
      artist(id: $artistId) {
        stats {
          ...UserStatsFields
        }
      }
    }

    ${UserStatsFields}
  `;

  const { artist: { stats: queryStats } } = await client.request(
    print(query),
    variables
  );

  const { playSong: { artistStats: mutationStats } } = await client.request(
    mutation,
    variables
  );

  expectPlayCountUpdated(queryStats, mutationStats);
});

it('should update album play count', async () => {
  const variables = {
    ...variables,
    albumId: 'album:1',
  };

  const query = gql`
    query($albumId: ID!) {
      album(id: $albumId) {
        stats {
          ...UserStatsFields
        }
      }
    }

    ${UserStatsFields}
  `;

  const { album: { stats: queryStats } } = await client.request(
    print(query),
    variables
  );

  const { playSong: { albumStats: mutationStats } } = await client.request(
    mutation,
    variables
  );

  expectPlayCountUpdated(queryStats, mutationStats);
});

it('should update playlist play count', async () => {
  const variables = {
    ...variables,
    playlistId: 'playlist:2',
  };

  const query = gql`
    query($playlistId: ID!) {
      playlist(id: $playlistId) {
        stats {
          ...UserStatsFields
        }
      }
    }

    ${UserStatsFields}
  `;

  const { playlist: { stats: queryStats } } = await client.request(
    print(query),
    variables
  );

  const { playSong: { playlistStats: mutationStats } } = await client.request(
    mutation,
    variables
  );

  expectPlayCountUpdated(queryStats, mutationStats);
});

it('should fail when called with artist, album and playlist descriptors', async () =>
  expect(
    client.request(mutation, {
      ...variables,
      artistId: 'artist:1',
      albumId: 'album:1',
      playlistId: 'playlist:2',
    })
  ).rejects.toThrow(ClientError));

it('should fail when called with artist and album descriptors', async () =>
  expect(
    client.request(mutation, {
      ...variables,
      artistId: 'artist:1',
      albumId: 'album:1',
    })
  ).rejects.toThrow(ClientError));

it('should fail when called with artist and playlist descriptors', async () =>
  expect(
    client.request(mutation, {
      ...variables,
      artistId: 'artist:1',
      playlistId: 'playlist:2',
    })
  ).rejects.toThrow(ClientError));

it('should fail when called with playlist and album descriptors', async () =>
  expect(
    client.request(mutation, {
      ...variables,
      albumId: 'album:1',
      playlistId: 'playlist:2',
    })
  ).rejects.toThrow(ClientError));
