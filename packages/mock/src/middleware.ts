import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import { songUrlForId } from './audioFiles';

export const applyMiddleware = (app: express.Application) => {
  const server = new ApolloServer({ schema });
  server.applyMiddleware({ app });

  app.get('/files/music/:id/raw', (req, res) => {
    const id = req.params.id;
    const url = songUrlForId(id);

    res.redirect(url);
  });
};
