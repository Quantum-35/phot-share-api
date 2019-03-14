const { GraphQLScalarType } = require('graphql');
const authorizeWithGithub = require('../../utils/auth');
const axios = require('axios');

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

module.exports = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: () => photos,
        allUsers: (parent, args, {db}) => {
            let k = db.collection('users')
                .find()
                .toArray()
            return k
        },
        totalUsers: (parent, args, {db}) => {
            return db.collection('users')
                .estimatedDocumentCount()
        },
        me: (parent, args, {currentUser}) => currentUser

    },
    Mutation: {
      async postPhoto(parent, args, {db, currentUser}) {
        if(!currentUser) throw new Error('You are not authorized to perform this action')
        const newPhoto = {
          userID: currentUser.githubLogin,
          ...args.input,
          created: new Date()
        }
        const {insertedIds} = await db.collection('photos').insert(newPhoto);
        newPhoto.id = insertedIds[0]
        return newPhoto
      },
      githubAuth: async(parent, {code}, {db}) => {
          // obtain Data from github
          let { message, access_token, avatar_url, login, name} = await authorizeWithGithub({
              client_id: process.env.CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              code,
          });
          // if there is a message then something went wrong
          if(message) {
              throw new Error(message);
          }

          let latestUserinfo = {
              name: name ? name : login,
              githubLogin: login,
              githubToken: access_token,
              avatar: avatar_url
          };
        //   console.log(latestUserinfo)

          const {ops:[user]} = await db.collection("users")
                                .replaceOne({githubLogin:login}, latestUserinfo, {upsert:true})
          return { user, token: access_token };
      },
      addFakeUsers: async(parent, {count}, {db}) => {
          const randomUserApi = `https://randomuser.me/api/?results=${count}`;
          const { results } = await axios.get(randomUserApi)
                                    .then(res => res.data)
          const users = results.map(r => ({
              githubLogin: r.login.username,
              name: `${r.name.first}${r.name.last}`,
              avatar: r.picture.thumbnail,
              githubToken: r.login.sha1
          }));
          await db.collection('users').insertMany(users);
          return users;
      },
      fakeUserAuth: async(parent, {githubLogin}, {db}) => {
          const user = await db.collection('users').findOne({githubLogin});
          if(!user) throw new Error('Can not Find user with that ID')
          return {
              token: user.githubToken,
              user
          }
      }
    },
    Photo: {
      id: parent => parent.id || parent._id,
      url: parent => `http://quantum.com/img/${parent._id}.jpg`,
      postedBy: (parent, args, {db}) => {
        return db.collection('users').findOne({githubLogin: parent.userID})
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
  };