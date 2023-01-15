var express = require('express');
var router = express.Router();
const request = require('request');
const {getRepositories,getUser}=require('../services/github.service');
const client = require('prom-client');

let register = new client.Registry();
client.collectDefaultMetrics({ register })

const requests_counter = new client.Counter({
  name: 'http_requests_counter',
  help: 'Number of http requests',
  labelNames: ['route', 'statusCode'],
});
 
register.registerMetric(requests_counter)

/* GET Repositories of a user by username. */
router.get('/repos', async function(req, res, next) {
 
    const username= req.query.username || '';
    if (username.length>0)
    {
        getRepositories(username).then(response =>{
        requests_counter.inc({route : '/repos',statusCode:200});
        res.status(200).send(response.data);
      },error =>{
        console.error(err);
        requests_counter.inc({route : '/repos',statusCode:400});
        res.status(500).send({error : error});
      });
  }else{
        requests_counter.inc({route : '/repos',statusCode:400});
        res.status(400).send({error : 'Username undefined'});
  }
  
});
/* GET a user account by username. */
router.get('/user', async function(req, res, next) {
 
    const username= req.query.username || '';
    if (username.length>0)
    {
    getUser(username).then(response =>{
      requests_counter.inc({route : '/user',statusCode:200});
      res.status(200).send(response.data);
    },error =>{
      console.error(err);
      requests_counter.inc({route : '/user',statusCode:400});
      res.status(400).send({error : error});
    });
  }else{
    requests_counter.inc({route : '/user',statusCode:400});
    res.status(400).send({error : 'Username undefined'});
  }
});

router.get('/metrics',async (req,res)=>{
  res.setHeader('Content-type',register.contentType);
  res.end(await register.metrics());
})

module.exports = router;
