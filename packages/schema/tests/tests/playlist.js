import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

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

it('should create a new playlist', async () => {
  const variables = {
    name: 'Test Created Playlist',
    description: 'This is a test playlist created for testing reasons.',
    songs: ['song:4:6', 'song:4:16', 'song:4:19'],
  };

  const mutation = gql`
    mutation($name: String!, $description: String!, $songs: [ID!]!) {
      createPlaylist(
        input: { name: $name, description: $description }
        songs: $songs
      ) {
        ...PlaylistFields

        items(first: -1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }

    ${PlaylistFields}
  `;

  const { createPlaylist } = await client.request(print(mutation), variables);

  expect(createPlaylist).toMatchObject({
    name: variables.name,
    description: variables.description,
    items: {
      edges: variables.songs.map(id => ({ node: { id } })),
    },
  });
});
