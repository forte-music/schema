import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import { testConnection } from '../connection';
import { testSort } from '../sort';

import PlaylistFields from './fragments/PlaylistFields.graphql';
import PlaylistItemFields from './fragments/PlaylistItemFields.graphql';
import SongFields from './fragments/SongFields.graphql';
import UserStatsFields from './fragments/UserStatsFields.graphql';

import client from '../client';
import { uuidForNum } from '../utils';

it('should get a playlist by id', async () => {
  const variables = { playlistId: uuidForNum(1) };

  const query = gql`
    query($playlistId: ID!) {
      playlist(id: $playlistId) {
        ...PlaylistFields

        items(first: 10) {
          edges {
            node {
              ...PlaylistItemFields

              song {
                ...SongFields
              }
            }
          }
        }
      }
    }

    ${PlaylistFields}
    ${PlaylistItemFields}
    ${SongFields}
  `;

  const resp = await client.request(print(query), variables);
  expect(resp).toMatchSnapshot();
});

const PlaylistFragment = gql`
  fragment PlaylistFragment on Playlist {
    ...PlaylistFields

    items(first: -1) {
      edges {
        node {
          song {
            id
          }
        }
      }
    }
  }

  ${PlaylistFields}
`;

const expectMatchesPlaylist = async (playlistId, expectedPlaylist) => {
  const query = gql`
    query($playlistId: ID!) {
      playlist(id: $playlistId) {
        ...PlaylistFragment
      }
    }

    ${PlaylistFragment}
  `;

  const { playlist: queriedPlaylist } = await client.request(print(query), {
    playlistId,
  });

  expect(queriedPlaylist).toMatchObject({
    id: playlistId,
    ...expectedPlaylist,
  });
};

testConnection('playlist', async ({ first, after }) => {
  const query = gql`
    query($playlistId: ID!, $first: Int, $after: String) {
      playlist(id: $playlistId) {
        items(first: $first, after: $after) {
          count
          pageInfo {
            hasNextPage
          }

          edges {
            cursor

            node {
              id
            }
          }
        }
      }
    }
  `;

  const { playlist: { items } } = await client.request(print(query), {
    playlistId: uuidForNum(3),
    first,
    after,
  });

  return items;
});

testConnection('playlists', async ({ first, after }) => {
  const query = gql`
    query($first: Int, $after: String) {
      playlists(first: $first, after: $after) {
        count
        pageInfo {
          hasNextPage
        }

        edges {
          cursor

          node {
            id
          }
        }
      }
    }
  `;

  const { playlists } = await client.request(print(query), {
    first,
    after,
  });

  return playlists;
});

testSort('playlists', async ({ sortBy, reverse }) => {
  const query = gql`
    query($sortBy: SortBy!, $reverse: Boolean!) {
      playlists(first: -1, sort: { sortBy: $sortBy, reverse: $reverse }) {
        edges {
          node {
            id
            name
            timeAdded
            stats {
              ...UserStatsFields
            }
          }
        }
      }
    }

    ${UserStatsFields}
  `;

  const { playlists: { edges } } = await client.request(print(query), {
    sortBy,
    reverse,
  });

  return edges.map(({ node }) => node);
});

testSort('playlist items', async ({ sortBy, reverse }) => {
  const query = gql`
    query($playlistId: ID!, $sortBy: SortBy!, $reverse: Boolean!) {
      playlist(id: $playlistId) {
        items(first: -1, sort: { sortBy: $sortBy, reverse: $reverse }) {
          edges {
            node {
              song {
                id
                name
                timeAdded
                stats {
                  ...UserStatsFields
                }
              }
            }
          }
        }
      }
    }

    ${UserStatsFields}
  `;

  const { playlist: { items: { edges } } } = await client.request(
    print(query),
    {
      sortBy,
      reverse,
      playlistId: uuidForNum(3),
    }
  );

  return edges.map(({ node: { song } }) => song);
});
