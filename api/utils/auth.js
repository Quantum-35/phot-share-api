const axios = require('axios');

const requestGithubToken = credentials => {
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }
    const body = JSON.stringify(credentials)
    return axios.post('https://github.com/login/oauth/access_token', body, headers)
    .then(res => {
        const msg = res.data;
        if(msg.access_token){
            return msg
        }
        throw new Error(msg)
    })
    .catch(error => {
        throw new Error(JSON.stringify(error));
    })
}

const requestGithubUserAccount = token => (
    axios.get(`https://api.github.com/user?access_token=${token}`)
    .then(res => {
        return res
    })
    .catch(error => console.log(error))
)

const authorizeWithGithub = async(credentials) => {
    const {access_token} = await requestGithubToken(credentials);
    const githubUserData = await requestGithubUserAccount(access_token);
    const githubUser = githubUserData.data;
    return {...githubUser, access_token}
}

module.exports = authorizeWithGithub;
