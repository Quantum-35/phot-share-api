import React from 'react';
import { Query } from 'react-apollo';
import Users, { ROOT_QUERY } from './Users';
import SignupFakeUsers from '../Auth/Signup/SignupFakeUsers';
import ListenForUsers from './ListenForUsers';
import Photos from '../Photos/Photos';
import PostPhoto from '../Photos/PostPhoto';

interface iProps {
    results: any
    logout: (body:any) => void
}

export const CurrentUser: React.SFC<iProps> =({results, logout}) => {
  return (
    <Query  query={ROOT_QUERY}>
        {
            res => 
                <div>
                    <SignupFakeUsers />
                    <Users />
                    <ListenForUsers />
                    <Photos />
                    <PostPhoto />
                    <div style={{position:"absolute", top:"1rem", left:"40rem", margin: "1rem 4rem", width: "50rem", borderStyle: "groove", borderRadius: "5rem"}}>
                    <div style={{margin: "3rem 6rem"}}>
                            {console.log(results)}
                            <img src={results.me.avatar} alt="Profile Pic" style={{width: "10rem", borderRadius: "5rem"}}/>
                            <h1>{results.me.name}</h1>
                            <button onClick={logout}>Logout</button>
                    </div>
                    </div>
                </div>
        }
    </Query>
  )
}

export default CurrentUser;
