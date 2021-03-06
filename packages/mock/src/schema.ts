import * as rawSchema from '@forte-music/schema/schema.json';
import resolvers from './resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { buildClientSchema, GraphQLSchema, printSchema } from 'graphql';

const typeDefs = printSchema(buildClientSchema(rawSchema));

const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

/**
 * An GraphQL schema which will resolve with mock data.
 */
export default schema;
