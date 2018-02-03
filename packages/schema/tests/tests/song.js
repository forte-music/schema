import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import SongFields from './fragments/SongFields.graphql';
import AlbumFields from './fragments/AlbumFields.graphql';
import ArtistFields from './fragments/ArtistFields.graphql';
import UserStatsFields from './fragments/UserStatsFields.graphql';
import SongUserStatsFields from './fragments/SongUserStatsFields.graphql';

import client from '../client';

const variables = { songId: 'song:2:1' };
it('should get a song by id', async () => {
  const query = gql`
    query($songId: ID!) {
      song(id: $songId) {
        ...SongFields

        album {
          ...AlbumFields
        }

        artists {
          ...ArtistFields
        }

        stats {
          ...UserStatsFields
        }

        songStats {
          ...SongUserStatsFields
        }
      }
    }

    ${SongFields}
    ${AlbumFields}
    ${ArtistFields}
    ${UserStatsFields}
    ${SongUserStatsFields}
  `;

  const data = await client.request(print(query), variables);

  expect(data).toMatchSnapshot();
});

it('should get all items when limit is -1', async () => {
  const { songs } = await client.request(
    `
      query {
        songs(first: -1) {
          pageInfo {
            hasNextPage
            count
          }
          edges {
            cursor
            node {
              id
            }
          }
        }
      }
    `
  );

  expect(songs.pageInfo.count).toBeTruthy();
  expect(songs.pageInfo.count).toEqual(songs.edges.length);
});
