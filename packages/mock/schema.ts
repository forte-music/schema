import { data as rawSchema } from '@forte-music/schema';
import resolvers from './resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { buildClientSchema, printSchema } from 'graphql';

const typeDefs = printSchema(buildClientSchema(rawSchema));

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
