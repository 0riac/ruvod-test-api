require('module-alias/register');
require('dotenv').config();
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const config = require('./src/config');
const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');
const dataSources = require('./src/dataSources');
const context = require('./src/context');
const controllers = require('./src/controllers');
const webauthn = require('./src/controllers/webauthn')

mongoose.connect(process.env.MONGO_URL);

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.APP_URL); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}))

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/auth', controllers.checkAuth);
app.post('/auth', controllers.auth);
app.get('/auth/webauthn', webauthn.authenticate(), controllers.afterWebauthn);
app.post('/createClient', controllers.createClient);
app.get('/logout', controllers.logOut);


app.use('/webauthn', webauthn.initialize());

// Endpoint without passport
// app.get('/secret', webauthn.authenticate(), (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'Super Secret!' })
// })
app.use('/auth/github/callback', controllers.githubCallbackMiddleware);
app.use('/auth/github', controllers.githubAuthMiddleware);

app.use(controllers.authMiddleware);
app.get('/me', controllers.me);

const apolloServer = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  dataSources,
  context,
});

apolloServer.applyMiddleware({ app, cors: config.cors });

app.listen({ port: process.env.PORT}, () => {
  console.log(`🚀  Server ready at port: ${process.env.PORT}, graphql path: ${apolloServer.graphqlPath}`);
});
