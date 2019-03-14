import React, { Component } from 'react';
import ApolloClient, {gql, InMemoryCache, NormalizedCache, NormalizedCacheObject} from 'apollo-boost';
import { ApolloProvider, Mutation } from 'react-apollo';
import { persistCache } from 'apollo-cache-persist';
import MainAuth from './container/Auth/MainAuth/MainAuth';
import { ROOT_QUERY } from './container/Users/Users';
import { withRouter } from 'react-router';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';
import { async } from 'q';

interface iState {
  loggedIn: boolean,
}

interface iProps {
  history: any,
  githubAuthMutation: (body:any) => void
}

export const GITHUB_AUTH_QUERY = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) { token }
  }
`;
let githubAuthMutation:any;
class App extends Component<iProps, iState> {
  state = {
    loggedIn: false,
  }
  
  async componentDidMount() {
    if(window.location.search.match(/code=/)){
      this.setState({loggedIn: true});
      const code = window.location.search.replace("?code=", "")
      githubAuthMutation({variables: {code}})
      this.props.history.replace('/')
    }
  }
  
  requesteCode = () => {
    var clientID = process.env.REACT_APP_CLIENT_ID
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
    this.props.history.replace="/"
  }
  
  authorizationComplete = (cache:any, {data}:any) => {
    localStorage.setItem('token', data.githubAuth.token);
    this.props.history.replace('/');
    this.setState({loggedIn: true})
  }
  
  render() {
    const cache = new InMemoryCache();
    persistCache({
      cache,
      storage: window.localStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>
    })
    if(localStorage['apollo-cache-persist']) {
      let cachedData = JSON.parse(localStorage['apollo-cache-persist']);
      cache.restore(cachedData)
    }
    const client = new ApolloClient({
      cache,
      uri: process.env.REACT_APP_BASE_URL,
      request: (operation):any => {
        operation.setContext((context:any) => ({
          headers: {
            ...context.headers,
            authorization: localStorage.getItem('token')
          }
        }))
      }
    });
    const {loggedIn} = this.state;
    return (
      <ApolloProvider client={client}>
        <div className='App'>
          {
            loggedIn ? 
                  <div> 
                    {/* <SignupFakeUsers />
                    <Users /> */}
                  </div>
                  :<Mutation mutation={GITHUB_AUTH_QUERY} /*variables={{code: code}}*/ refetchQueries={[{query: ROOT_QUERY}]} update={this.authorizationComplete}>
                  {
                    (mutation: any) => {
                      githubAuthMutation = mutation
                      return (
                        <MainAuth loggedIn={loggedIn} requestCode={this.requesteCode} logout={() => localStorage.removeItem('token')}/>
                      )
                    }
                    
                  }
                </Mutation>
          }
        </div>
      </ApolloProvider>
    );
  }
}

export default withRouter<any>(App);
