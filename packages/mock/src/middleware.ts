import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';

export const applyMiddleware = (app: express.Application) => {
  const server = new ApolloServer({ schema });
  server.applyMiddleware({ app });
};
