const express = require('express');
const { ApolloServer, PubSub } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { readFileSync } = require('fs');
const resolvers = require('./graphql/resolvers/resolvers');
const { createServer } = require('http');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const mongoConnect = require('./utils/Database').mongoConnect;
const { getDb } = require('./utils/Database');

const typeDefs = readFileSync('./graphql/schema/typeDefs.graphql', 'UTF-8');

mongoConnect(() =>{
  const db = getDb();
  const pubsub = new PubSub();
  const app = express();
  app.use(cors());
  app.use('/img/photos', express.static(path.join(__dirname, 'graphql', 'assets', 'photos')))
  app.get('/', (req, res) => res.end('Welcome to PhotoShare API'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql'}));

  // Create a new Instance of the server and pass the (typeDef)schema and the ressolver;
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    engine: true,
    context: async({req, connection}) => {
      const githubToken = req ? req.headers.authorization : connection.context.Authorization;
      const currentUser = await db.collection('users').findOne({ githubToken });
      return {db, currentUser, pubsub}
    }
  });

  // call applyMiddleware to middleware to be mounted on the same Path.
  server.applyMiddleware({ app });

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer)
  httpServer.listen({port: 4000}, () => {
    console.log(`Graphql server running at  http://localhost:4000${server.graphqlPath}`);
  });
});
