import * as rawSchema from '@forte-music/schema/schema.json';
import resolvers from './resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { buildClientSchema, printSchema } from 'graphql';

const typeDefs = printSchema(buildClientSchema({ __schema: rawSchema }));

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
