require('dotenv').config()

const express = require('express');
const router = require('./routes');
const cors = require('cors');
const knex = require('knex');
const apiErrorHandler = require('./errors/api_handler')
const db = require('./db')(knex);
const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use(apiErrorHandler);

app.listen(3000, () => console.log('server listening on port 3000'));