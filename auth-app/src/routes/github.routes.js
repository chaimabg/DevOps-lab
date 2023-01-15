var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET repositories listing for user. */
router.get('/github-repos', function(req, res, next) {
  const username=req.query.username;
  if(username)
  {axios.get(`${process.env.GITHUB_APP_URL}/repos?username=${username}`)
  .then(response => {
    res.status(200).send({repos: response.data})
  })
  .catch(error => {
    res.status(500).send(error);
  });
}else {
  res.status(400).send({error : 'Username undefined'})
}
});

/* GET user credentials. */
router.get('/github-user', function(req, res, next) {
  const username=req.query.username;
  if(username)
  {axios.get(`${process.env.GITHUB_APP_URL}/user?username=${username}`)
  .then(response => {
    res.status(200).send(response.data)
  })
  .catch(error => {
    res.status(500).send(error);
  });
}else {
  res.status(400).send({error : 'Username undefined'})
}
});

module.exports = router;
