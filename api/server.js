const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const KnexSessionStore = require('connect-session-knex')(session);

const apiRouter = require('./api-router');

const server = express();

const config = {
  name: 'Gorilla',
  secret: 'Monkey hidden in a gorilla suit',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require('../database/db-config'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(session(config));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api', apiRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

module.exports = server;
