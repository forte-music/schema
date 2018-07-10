import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';

import client from '../client';

it(`should get the top most recently added items sorted from most recently added to least recently added`, async () => {
  const query = gql`
    query {
      recentlyAdded(first: 10) {
        ... on Album {
          timeAdded
        }

        ... on Artist {
          timeAdded
        }
      }
    }
  `;

  const { recentlyAdded } = await client.request(print(query));

  expect(recentlyAdded).toEqual(
    recentlyAdded.slice().sort((a, b) => b.timeAdded - a.timeAdded)
  );
});

it(`should get the top most recently played items from most recently played to least recently played`, async () => {
  const query = gql`
    query {
      recentlyPlayed(first: 10) {
        ... on Album {
          stats {
            lastPlayed
          }
        }

        ... on Artist {
          stats {
            lastPlayed
          }
        }
      }
    }
  `;

  const { recentlyPlayed } = await client.request(print(query));

  expect(recentlyPlayed).toEqual(
    recentlyPlayed
      .slice()
      .sort((a, b) => b.stats.lastPlayed - a.stats.lastPlayed)
  );
});
