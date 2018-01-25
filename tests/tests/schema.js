import { buildASTSchema } from 'graphql';
import {
  findBreakingChanges,
  introspectionQuery,
  buildClientSchema,
} from 'graphql/utilities';

import schema from '../../schema.graphql';
import client from '../client';

const getSchema = async client => {
  const data = await client.request(introspectionQuery);
  const schema = buildClientSchema(data);

  return schema;
};

it("shouldn't have any breaking changes against the schema", async () => {
  const expectedSchema = buildASTSchema(schema);
  const actualSchema = await getSchema(client);

  const changes = findBreakingChanges(actualSchema, expectedSchema).filter(
    change => change.type !== 'DIRECTIVE_LOCATION_REMOVED'
  );

  expect(changes).toEqual([]);
});
