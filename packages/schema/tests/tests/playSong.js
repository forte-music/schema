import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import client from '../client';

import UserStatsFields from './fragments/UserStatsFields.graphql';
import SongUserStatsField from './fragments/SongUserStatsFields.graphql';
import { uuidForNum } from '../utils';

const variables = { songId: uuidForNum(1) };

const mutation = print(gql`
  mutation($songId: ID!, $artistId: ID, $albumId: ID, $playlistId: ID) {
    playSong(
      songId: $songId
      artistId: $artistId
      albumId: $albumId
      playlistId: $playlistId
    ) {
      song {
        songStats {
          ...SongUserStatsFields
        }

        stats {
          ...UserStatsFields
        }
      }

      albumStats {
        ...UserStatsFields
      }

      artistStats {
        ...UserStatsFields
      }

      playlistStats {
        ...UserStatsFields
      }
    }
  }

  ${UserStatsFields}
  ${SongUserStatsField}
`);

// Checks whether the play count has increased by one and whether the
// lastPlayed time has been updated.
const expectPlayCountUpdated = (songQueryStats, songMutationStats) => {
  expect(songMutationStats).toMatchObject({
    id: songQueryStats.id,
    playCount: songQueryStats.playCount + 1,
  });
};

const expectPlayTimeUpdated = (queryStats, mutationStats) => {
  expect(mutationStats.lastPlayed).toBeGreaterThan(queryStats.lastPlayed || 0);
};

it('should update song play count', async () => {
  const query = gql`
    query($songId: ID!) {
      song(id: $songId) {
        stats {
          ...UserStatsFields
        }

        songStats {
          ...SongUserStatsFields
        }
      }
    }

    ${UserStatsFields}
    ${SongUserStatsField}
  `;

  const {
    song: { stats: queryStats, songStats: songQueryStats },
  } = await client.request(print(query), variables);

  const {
    playSong: { song: { stats: mutationStats, songStats: songMutationStats } },
  } = await client.request(mutation, variables);

  expectPlayTimeUpdated(queryStats, mutationStats);
  expectPlayCountUpdated(songQueryStats, songMutationStats);
});

it('should update artist play time', async () => {
  const localVariables = { ...variables, artistId: uuidForNum(1) };

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
    localVariables
  );

  const { playSong: { artistStats: mutationStats } } = await client.request(
    mutation,
    localVariables
  );

  expectPlayTimeUpdated(queryStats, mutationStats);
});

it('should update album play time', async () => {
  const localVariables = {
    ...variables,
    albumId: uuidForNum(3),
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
    localVariables
  );

  const { playSong: { albumStats: mutationStats } } = await client.request(
    mutation,
    localVariables
  );

  expectPlayTimeUpdated(queryStats, mutationStats);
});

it('should update playlist play time', async () => {
  const localVariables = {
    ...variables,
    playlistId: uuidForNum(2),
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
    localVariables
  );

  const { playSong: { playlistStats: mutationStats } } = await client.request(
    mutation,
    localVariables
  );

  expectPlayTimeUpdated(queryStats, mutationStats);
});

it('should fail when called with artist, album and playlist descriptors', async () =>
  expect(
    client.request(mutation, {
      ...variables,
      artistId: uuidForNum(1),
      albumId: uuidForNum(1),
      playlistId: uuidForNum(2),
    })
  ).rejects.toThrow());

it('should fail when called with artist and album descriptors', async () =>
  expect(
    client.request(mutation, {
      ...variables,
      artistId: uuidForNum(1),
      albumId: uuidForNum(1),
    })
  ).rejects.toThrow());

it('should fail when called with artist and playlist descriptors', async () =>
  expect(
    client.request(mutation, {
      ...variables,
      artistId: uuidForNum(1),
      playlistId: uuidForNum(2),
    })
  ).rejects.toThrow());

it('should fail when called with playlist and album descriptors', async () =>
  expect(
    client.request(mutation, {
      ...variables,
      albumId: uuidForNum(1),
      playlistId: uuidForNum(2),
    })
  ).rejects.toThrow());
