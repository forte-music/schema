import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import AlbumFields from './fragments/AlbumFields.graphql';
import ArtistFields from './fragments/ArtistFields.graphql';
import SongFields from './fragments/SongFields.graphql';

import client from '../client';

const variables = { albumId: 'album:4' };
it('should get an album by id', async () => {
  const query = gql`
    query($albumId: ID!) {
      album(id: $albumId) {
        ...AlbumFields

        artist {
          ...ArtistFields
        }

        songs {
          ...SongFields
        }
      }
    }

    ${AlbumFields}
    ${ArtistFields}
    ${SongFields}
  `;

  const { album } = await client.request(print(query), variables);

  expect(album).toMatchSnapshot();
});

it('should calculate the duration for an album', async () => {
  const { album } = await client.request(
    `
      query($albumId: ID!) {
        album(id: $albumId) {
          id
          duration
        }
      }
    `,
    variables
  );

  expect(album).toMatchObject({
    id: variables.albumId,
    duration: 74 * 60 + 22,
  });
});
