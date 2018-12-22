import * as express from 'express';
import { applyMiddleware } from '../src';

const app = express();
applyMiddleware(app);

console.log('listening on port 4000');
app.listen(4000);
