const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { readFileSync } = require('fs');
const resolvers = require('./graphql/resolvers/resolvers');
require('dotenv').config()

const mongoConnect = require('./utils/Database').mongoConnect;
const { getDb } = require('./utils/Database');

const typeDefs = readFileSync('./graphql/schema/typeDefs.graphql', 'UTF-8');

mongoConnect(() =>{
  const db = getDb();
  const context = {db};
  // Create a new Instance of the server and pass the (typeDef)schema and the ressolver;
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async({req}) => {
      const githubToken = req.headers.authorization
      const currentUser = await db.collection('users').findOne({githubToken})
      return {db, currentUser}
    }
  });

  const app = express();


  // call applyMiddleware to middleware to be mounted on the same Path.
  server.applyMiddleware({ app });

  app.get('/', (req, res) => res.end('Welcome to PhotoShare API'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql'}));

  return app.listen(4000, () => {
    console.log(`Graphql Server running at http://localhost:4000${server.graphqlPath}`)
  })
});
