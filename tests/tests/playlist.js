import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import PlaylistFields from './fragments/PlaylistFields.graphql';
import PlaylistItemFields from './fragments/PlaylistItemFields.graphql';
import SongFields from './fragments/SongFields.graphql';

import client from '../client';

it('should resolve a query for data stemming from a playlist', async () => {
  const variables = { playlistId: 'playlist:1' };

  const query = gql`
    query($playlistId: ID!) {
      playlist(id: $playlistId) {
        ...PlaylistFields

        items(input: { limit: 10 }) {
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
