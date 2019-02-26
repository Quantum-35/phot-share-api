const { ApolloServer } = require('apollo-server');

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
    "githubUser": "quantum"
  },
  {
    "id": 2,
    "name": "Dropping",
    "description": "The heart chute is one of my favorite chutes",
    "category": "SELFIE",
    "githubUser": "hello"
  },
  {
    "id": 3,
    "name": "Cloud",
    "description": "Awsome cloud, Not Cloud Computing",
    "category": "SELFIE",
    "githubUser": "hello"
  }
];

const typeDefs = `
type User {
  githubLogin: ID!,
  name: String!,
  avatar: String,
  postedPhotos: [Photo!]!
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
  postedBy: User!
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
        ...args.input
      }
      photos.push(newPhoto)
      return newPhoto
    }
  },
  Photo: {
    url: parent => `http://quantum.com/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubUser)
    }
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(u => u.githubUser === parent.githubLogin)
    }
  }
}

// Create a new Instance of the server and pass the (typeDef)schema and the ressolver;
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server
.listen()
.then(({url}) => console.log("GraphQl server runing at ", url));
