import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import {ROOT_QUERY} from '../../Users/Users';

interface iProps {
}

const ADD_FAKE_USERS_MUTATION = gql`
    mutation addFakeUsers($count:Int!) {
        addFakeUsers(count: $count) {
        githubLogin
        name
        avatar
     }
    }
`;

const SignupFakeUsers: React.SFC<iProps> = (props) => {
  return (
    <div style={{float: "right", margin: "1rem 2rem"}}>
        <Mutation mutation={ADD_FAKE_USERS_MUTATION} variables={{count: 1}} refetchQueries={[{query: ROOT_QUERY}]}>
            {
                (addFakeUser:any) => <button onClick={addFakeUser}>Add Fake User</button>
            }
        </Mutation>
    </div>
  )
}

export default SignupFakeUsers
