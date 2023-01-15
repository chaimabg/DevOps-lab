const { Octokit, App } = require("octokit");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });




exports.getUser = (username)=>{
    return octokit.request('GET /users/{username}', {
        username: username || process.env.GITHUB_USERNAME
    });
}
exports.getRepositories =(username) =>{
    return octokit.request('GET /users/{username}/repos', {
        username: username || process.env.GITHUB_USERNAME
    });
}
