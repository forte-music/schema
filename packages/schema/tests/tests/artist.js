import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import { testConnection } from '../connection';

import client from '../client';

testConnection('artists', async ({ first, after }) => {
  const query = gql`
    query($first: Int, $after: String) {
      artists(first: $first, after: $after) {
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

  const { artists } = await client.request(print(query), {
    first,
    after,
  });

  return artists;
});
