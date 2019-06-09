import { buildASTSchema } from 'graphql';
import {
  findBreakingChanges,
  introspectionQuery,
  buildClientSchema,
} from 'graphql/utilities';

import schemaAST from '@forte-music/schema/schema.graphql';
import client from '../client';

const apiSchema = buildASTSchema(schemaAST);

const getSchema = async client => {
  const data = await client.request(introspectionQuery);
  const schema = buildClientSchema(data);

  return schema;
};

// Tests whether the schema exposed by the remote is compatible with the API
// schema.
it('should be compatible with the expected schema', async () => {
  const remoteSchema = await getSchema(client);

  const ignoreChangesPredicate = change =>
    ['DIRECTIVE_LOCATION_REMOVED', 'DIRECTIVE_REMOVED'].indexOf(change.type) ===
    -1;

  const schemaBreakingChanges = findBreakingChanges(
    apiSchema,
    remoteSchema
  ).filter(ignoreChangesPredicate);

  // Shows breaking changes when going from the real schema to the remote
  // schema. To resolve these changes, undo them. For example if the change
  // says:
  //
  //     Query.albums arg input has changed type from ConnectionQuery to
  //     ConnectionQuery!
  //
  // To fix it, undo the change by changing ConnectionQuery! to
  // ConnectionQuery on the remote.
  expect(schemaBreakingChanges).toEqual([]);
});
