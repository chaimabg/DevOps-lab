var express = require('express');
var router = express.Router();
const request = require('request');
const {getRepositories,getUser}=require('../services/github.service');


/* GET Repositories of a user by username. */
router.get('/repos', async function(req, res, next) {
 
    const username= req.query.username || '';
    if (username.length>0)
    {
        getRepositories(username).then(response =>{
        res.status(200).send(response.data);
      },error =>{
        res.status(500).send({error : error});
      });
  }else{
        res.status(400).send({error : 'Username undefined'});
  }
  
});
/* GET a user account by username. */
router.get('/user', async function(req, res, next) {
 
    const username= req.query.username || '';
    if (username.length>0)
    {
    getUser(username).then(response =>{
      consulted_users_counter.inc({username:req.query.username});
      res.status(200).send(response.data);
    },error =>{
      res.status(400).send({error : error});
    });
  }else{
    res.status(400).send({error : 'Username undefined'});
  }
});


module.exports = router;
