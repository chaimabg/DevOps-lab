var express = require('express');
var router = express.Router();
const request = require('request');
const {getRepositories,getUser}=require('../services/github.service');
const client = require('prom-client');

let register = new client.Registry();


client.collectDefaultMetrics({ register })

const consulted_users_counter = new client.Counter({
  name: 'consulted_users',
  help: 'Github users the most consulted',
  labelNames: ['username'],
});

register.registerMetric(consulted_users_counter);


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
/* GET metrics. */
router.get('/metrics',async (req,res)=>{
  res.setHeader('Content-type',register.contentType);
  res.end(await register.metrics());
})

module.exports = router;
