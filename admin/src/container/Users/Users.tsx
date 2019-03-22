import React from 'react';
import {gql} from 'apollo-boost';
import { Query } from 'react-apollo';
import UserList from './UserList';

interface iProps {
    // res: any
}

export const ROOT_QUERY = gql`
    query allUsers {
        totalUsers
        allUsers {...userInfo}
        me {...userInfo}
        allPhotos {
            id
            name
            url
            postedBy {...userInfo}
        }
    }

    fragment userInfo on User {
        name
        avatar
        githubLogin
    }
`;


export  class Users extends React.Component<iProps> {
    render() {
      return (
        <Query query={ROOT_QUERY} >
            {
                result => result.loading ? 
                            <p>Loading Users...</p>
                            :
                            <UserList res={result} />
            }
        </Query>
      )
    }
}

export default Users;
