import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from '../src';

const apollo = new ApolloServer({ schema });
const app = express();

apollo.applyMiddleware({ app });

console.log('listening on port 4000');
app.listen(4000);
