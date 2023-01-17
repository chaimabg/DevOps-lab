var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 

const User = require("../models/User");

const logger=require("../config/logger")

const {client,register} = require('../config/prom-client');

  

const signinLogger= logger.child({
    route : '/signin'
});

const signupLogger= logger.child({
    route : '/signup'
});


const requests_counter = new client.Counter({
  name: 'http_requests_counter',
  help: 'Number of http requests',
  labelNames: ['route', 'statusCode'],
});
register.registerMetric(requests_counter);


/* login */
router.post('/signin', async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if (email && password) {

            User.findOne({ email: email }).then(async(existingUser) => {
                if (existingUser) {
                    const isAuthenticated = await bcrypt.compare(password, existingUser.password);
                    if (isAuthenticated) {
                        jwt.sign({
                                userId: existingUser._id,
                                email: existingUser.email,
                            },
                            process.env.JWT_SECRET_KEY,
                                (err, token) => {
                                    requests_counter.inc({route : '/signin',statusCode:200});
                                    signinLogger.info("User Authenticated", {
                                        REQ_ID: req.rid,
                                        Client_IP: req.socket.remoteAddress, 
                                    });
                                    res.status(200).send({
                                        username: existingUser.username,
                                        email: existingUser.email,
                                        token: token
                                    });
                                }
                            );
                        } else {
                            requests_counter.inc({route : '/signin',statusCode:400});
                            signinLogger.error("Password incorrect", {
                                REQ_ID: req.rid,
                                Client_IP: req.socket.remoteAddress, 
                            });
                            res.status(400).send({message: 'Your password is incorrect'})
                        }
    
                } else {
                    requests_counter.inc({route : '/signin',statusCode:400});
                    signinLogger.error("Email incorrect", {
                        REQ_ID: req.rid,
                        Client_IP: req.socket.remoteAddress, 
                    });
                    res.status(400).send({message: 'Address email or password incorrect'})

                }


            });
        }else {
            requests_counter.inc({route : '/signin',statusCode:400});
            signinLogger.warn("Parameters are not available for sign up", {
                REQ_ID: req.rid,
                Client_IP: req.socket.remoteAddress, 
            });
            res.status(400).send('All parameters is required !')
        }
        } catch (error) {
            requests_counter.inc({route : '/signin',statusCode:400});
            res.status(400).send({'error': error})
        }
    
});
/* GET users */
router.get('/',async(req,res,next)=>{
    User.find().then(users=>{
        requests_counter.inc({route : '/',statusCode:200});
        logger.info("All users returned", {
            REQ_ID: req.rid,
            Client_IP: req.socket.remoteAddress, 
        });
        res.status(200).send(users)
    ,error=>{
        requests_counter.inc({route : '/',statusCode:400});
        res.status(400).send(error)
    }})
})
/* signup */
router.post('/signup',async (req,res,next)=>{
    try{
     
        const {email,username, password}=req.body;
        if(email && password&&username){
            const existedUser = await User.findOne({ email: email });
            if (! existedUser)
        {    
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username: username,
                email: email,
                password: hashedPassword,
            });
            const result = await newUser.save();
            requests_counter.inc({route : '/signup',statusCode:201});
            signupLogger.info("User created", {
                REQ_ID: req.rid,
                Client_IP: req.socket.remoteAddress, 
            });
            res.status(201).send(result);
        }else{
            requests_counter.inc({route : '/signup',statusCode:400});
            signupLogger.error("Email Address already exists", {
                REQ_ID: req.rid,
                Client_IP: req.socket.remoteAddress, 
            });
                res.status(400).send({message: 'Address email already exists'})
            }
        }else {
            requests_counter.inc({route : '/signup',statusCode:400});
            signupLogger.warn("Parameters are not available for sign up", {
                REQ_ID: req.rid,
                Client_IP: req.socket.remoteAddress, 
            });
            res.status(400).send('All parameters is required !')
        }
    }catch (error) {
            requests_counter.inc({route : '/signup',statusCode:400});
            res.status(400).send({'error': error})
        }
   
});
/* GET metrics */
router.get('/metrics',async (req,res)=>{
    logger.info("metrics", {
        REQ_ID: req.rid,
        Client_IP: req.socket.remoteAddress,
    });
  res.setHeader('Content-type',register.contentType);
  res.end(await register.metrics());
})
module.exports=router;
