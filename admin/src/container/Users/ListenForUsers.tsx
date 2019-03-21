import React from 'react';
import { gql } from 'apollo-boost';
import { Subscription } from 'react-apollo';

const LISTEN_FOR_USERS = gql`
    subscription {
        newUser {
            githubLogin
            name
            avatar
        }
    }
`;

export const ListenForUsers = (props:any) => {
  return (
      <div style={{position: "absolute", top: "25rem", left: "35rem"}}>
        <Subscription subscription={LISTEN_FOR_USERS}>
            {
                ({data, loading}) => loading ? 
                    <p>loading New User ...</p>:
                    <div>
                        <img src={data.newUser.avatar} alt="New User"/>
                        <h2>{data.newUser.name}</h2>
                    </div>
            }
        </Subscription>
      </div>
  )
}

export default ListenForUsers;