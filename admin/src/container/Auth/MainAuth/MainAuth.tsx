import React from 'react';
import { Query } from 'react-apollo';

import { ROOT_QUERY } from '../../Users/Users';
import CurrentUser from '../../Users/CurrentUser';

interface iProp {
  loggedIn: boolean,
  requestCode: (body:any) => void,
  logout: (body:any) => void
}

 const MainAuth:React.SFC<iProp> = ({loggedIn, requestCode, logout}) =>{
  return (
      <Query query={ROOT_QUERY}>
        {
          results => results.data.me 
                            ? <div>
                                { results.loading ?
                                  <p>Loading ...</p>
                                  :<CurrentUser results={results.data} logout={logout}/>
                                }
                              </div>
                            :
                            <div style={{margin: "1rem 2rem"}}>
                                {console.log(results)}
                                <h1>This is the Signin/Login Page</h1>
                                <button disabled={loggedIn} onClick={requestCode} style={{padding: "0.5rem", background: "green", font: "1rem solid black", cursor: "pointer"}}>
                                  Signin with Github
                                </button>
                          </div>
        }
      </Query>
  )
}

export default MainAuth;
