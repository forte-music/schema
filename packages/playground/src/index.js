import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import '../node_modules/graphiql/graphiql.css';

import GraphiQL from 'graphiql';
import { parse } from 'graphql';

import schema from '@forte-music/mock/schema';
import { execute } from 'apollo-link';
import { SchemaLink } from 'apollo-link-schema';

const link = new SchemaLink({ schema });

const fetcher = operation => {
  operation.query = parse(operation.query);
  return execute(link, operation);
};

ReactDOM.render(
  <GraphiQL fetcher={fetcher} />,
  document.querySelector('#root')
);
