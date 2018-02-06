import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import { testConnection } from '../connection';
import PlaylistFields from './fragments/PlaylistFields.graphql';
import PlaylistItemFields from './fragments/PlaylistItemFields.graphql';
import SongFields from './fragments/SongFields.graphql';

import client from '../client';

it('should get a playlist by id', async () => {
  const variables = { playlistId: 'playlist:1' };

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

it('should create a new playlist', async () => {
  const variables = {
    name: 'Test Created Playlist',
    description: 'This is a test playlist created for testing reasons.',
    songs: ['song:4:6', 'song:4:16', 'song:4:19'],
  };

  const mutation = gql`
    mutation($name: String!, $description: String!, $songs: [ID!]!) {
      createPlaylist(name: $name, description: $description, songs: $songs) {
        ...PlaylistFragment
      }
    }

    ${PlaylistFragment}
  `;

  const { createPlaylist } = await client.request(print(mutation), variables);

  const expectedPlaylist = {
    name: variables.name,
    description: variables.description,
    items: {
      edges: variables.songs.map(id => ({ node: { song: { id } } })),
    },
  };

  expect(createPlaylist).toMatchObject(expectedPlaylist);
  await expectMatchesPlaylist(createPlaylist.id, expectedPlaylist);
});

it('should update an existing playlist', async () => {
  const variables = { playlistId: 'playlist:4' };

  const query = gql`
    query($playlistId: ID!) {
      playlist(id: $playlistId) {
        ...PlaylistFragment
      }
    }

    ${PlaylistFragment}
  `;

  const { playlist } = await client.request(print(query), variables);

  const mutation = gql`
    mutation($playlistId: ID!, $name: String, $description: String) {
      updatePlaylist(
        playlistId: $playlistId
        name: $name
        description: $description
      ) {
        ...PlaylistFragment
      }
    }

    ${PlaylistFragment}
  `;

  const mutationVariables = {
    ...variables,
    name: 'An Updated Playlist',
    description: 'A playlists which has been updated by the tests.',
  };

  const { updatePlaylist } = await client.request(
    print(mutation),
    mutationVariables
  );

  const expectedPlaylist = {
    id: variables.playlistId,
    name: mutationVariables.name,
    description: mutationVariables.description,
    items: playlist.items,
  };

  expect(updatePlaylist).toMatchObject(expectedPlaylist);

  await expectMatchesPlaylist(expectedPlaylist.id, expectedPlaylist);
});

it('should delete a playlist', async () => {
  const vars = { playlistId: 'playlist:5' };

  const mutation = gql`
    mutation($playlistId: ID!) {
      deletePlaylist(playlistId: $playlistId)
    }
  `;

  const { deletePlaylist } = await client.request(print(mutation), vars);

  expect(deletePlaylist).toBe(true);

  const query = gql`
    query($playlistId: ID!) {
      playlist(id: $playlistId) {
        id
      }
    }
  `;

  expect(client.request(print(query), vars)).rejects.toThrow();
});

testConnection('playlist', async ({ first, after }) => {
  const query = gql`
    query($playlistId: ID!, $first: Int, $after: String) {
      playlist(id: $playlistId) {
        items(first: $first, after: $after) {
          pageInfo {
            count
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
    playlistId: 'playlist:3',
    first,
    after,
  });

  return items;
});

testConnection('playlists', async ({ first, after }) => {
  const query = gql`
    query($first: Int, $after: String) {
      playlists(first: $first, after: $after) {
        pageInfo {
          count
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
