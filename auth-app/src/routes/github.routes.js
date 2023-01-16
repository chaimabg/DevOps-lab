var express = require('express');
var router = express.Router();
const axios = require('axios');

const logger = require("../config/logger");

const client = require('prom-client');



const githubReposLogger= logger.child({
  route : '/github-repos'
});

const githubUserLogger= logger.child({
  route : '/github-user'
});

/* GET repositories listing for user. */
router.get('/github-repos', function(req, res, next) {
  const username=req.query.username;
  if(username)
  {axios.get(`${process.env.GITHUB_APP_URL}/repos?username=${username}`)
  .then(response => {
    githubReposLogger.info("All repos returned", {
      REQ_ID: req.rid,
      username: username,
      Client_IP: req.socket.remoteAddress, 
  });
    res.status(200).send({repos: response.data})
  })
  .catch(error => {
    res.status(500).send(error);
  });
}else {
  githubReposLogger.warn("Username undefined", {
    REQ_ID: req.rid,
    Client_IP: req.socket.remoteAddress, 
});
  res.status(400).send({error : 'Username undefined'})
}
});

/* GET user credentials. */
router.get('/github-user', function(req, res, next) {
  const username=req.query.username;
  if(username)
  {axios.get(`${process.env.GITHUB_APP_URL}/user?username=${username}`)
  .then(response => {
    githubUserLogger.info("User info returned", {
      REQ_ID: req.rid,
      username: username,
      Client_IP: req.socket.remoteAddress, 
  });
    res.status(200).send(response.data)
  })
  .catch(error => {
    res.status(500).send(error);
  });
}else {
  githubUserLogger.warn("Username undefined", {
    REQ_ID: req.rid,
    Client_IP: req.socket.remoteAddress, 
});
  res.status(400).send({error : 'Username undefined'})
}
});

module.exports = router;
