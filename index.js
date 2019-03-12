const { ApolloServer } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');

let _id = 0;
const users = [
  {"githubLogin": "quantum", "name": "quantumComputing"},
  {"githubLogin": "hello", "name": "hello world"},
  {"githubLogin": "gilberto", "name": "sir Gilberto"}
]
let photos = [
  {
    "id": 1,
    "name": "Dropping the Heart Chute",
    "description": "The heart chute is one of my favorite chutes",
    "category": "ACTION",
    "githubUser": "quantum",
    "created": "3-28-1977"
  },
  {
    "id": 2,
    "name": "Dropping",
    "description": "The heart chute is one of my favorite chutes",
    "category": "SELFIE",
    "githubUser": "hello",
    "created": "1-2-1985"
  },
  {
    "id": 3,
    "name": "Cloud",
    "description": "Awsome cloud, Not Cloud Computing",
    "category": "SELFIE",
    "githubUser": "gilberto",
    "created": "2018-04-15T19:09:57.308Z"
  }
];

const tags = [
  {"photoID": 1, "userID": "quantum"},
  {"photoID": 2, "userID": "hello"},
  {"photoID": 3, "userID": "gilberto"},
  {"photoID": 1, "userID": "quantum"}
]

const typeDefs = `
scalar DateTime

type User {
  githubLogin: ID!,
  name: String!,
  avatar: String,
  postedPhotos: [Photo!]!,
  inPhotos: [Photo!]!
}

enum PhotoCategory {
  SELFIE,
  PORTRAIT,
  ACTION,
  LANDSCAPE,
  GRAPHIC
}

type Photo {
  id: ID!,
  url: String!,
  name: String!,
  category: PhotoCategory!,
  description: String,
  postedBy: User!,
  taggedUsers: [User!]!
  created: DateTime!
}

# Returns totalPhotos and all photos
type Query{
  totalPhotos: Int!,
  allPhotos: [Photo!]!
}

input PostPhotoInput {
  name: String!,
  category: PhotoCategory = PORTRAIT,
  description: String
}

# Returns a newly created Photo from the Mutation.
type Mutation {
  postPhoto(input: PostPhotoInput): Photo! 
}
`;

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },
  Mutation: {
    postPhoto(parent, args) {
      const newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date()
      }
      photos.push(newPhoto)
      return newPhoto
    }
  },
  Photo: {
    url: parent => `http://quantum.com/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubUser)
    },
    taggedUsers: parent => {
      const listTaggedUsers = tags.filter(tag => tag.photoID === parent.id)
          .map(tag => tag.userID)
          .map(uId => users.find(u => u.githubLogin === uId) );
      return listTaggedUsers;
    }
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(u => u.githubUser === parent.githubLogin)
    },
    inPhotos:  parent => {
      return tags.filter(tag => tag.userID === parent.id)
                  .map(tag => tag.photoID)
                  .map(photoID = photos.find(p => p.id === photoID));
    }
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid Date time',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
}

// Create a new Instance of the server and pass the (typeDef)schema and the ressolver;
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server
.listen()
.then(({url}) => console.log("GraphQl server runing at ", url));
