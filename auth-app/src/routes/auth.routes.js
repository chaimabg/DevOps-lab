var express = require('express');
var router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
/* login */
router.post('/signin',async (req,res,next)=>{
    try {
    const {email, password}=req.body;
    if(email && password){

             User.findOne({ email: email }).then(async (existingUser) => {
                if (existingUser) {
                        const isAuthenticated = await bcrypt.compare(password, existingUser.password);
                        if (isAuthenticated) {
                            jwt.sign(
                                {
                                    userId: existingUser._id,
                                    email: existingUser.email,
                                },
                                process.env.JWT_SECRET_KEY,
                                (err, token) => {
                                    res.status(200).send({
                                        username: existingUser.username,
                                        email: existingUser.email,
                                        token: token
                                    });
                                }
                            );
                        } else {
                            res.status(400).send({message: 'Your password is incorrect'})
                        }
    
                } else {
                    res.status(400).send({message: 'Address email or password incorrect'})
                }
    
    
            });
        }else {
            res.status(400).send('All parameters is required !')
        }
        } catch (error) {
            res.status(400).send({'error': error})
        }
    
});
router.get('/',async(req,res,next)=>{
    User.find().then(users=>{
        res.send(users)
    ,error=>{
        res.status(400).send(error)
    }})
})
/* signup */
router.post('/signup',async (req,res,next)=>{
    try{
     
        const {email,username, password}=req.body;
        console.log(email);
        if(email && password&&username){
            const existedUser = await User.findOne({ email: email });
            console.log(existedUser);
            if (! existedUser)
        {    
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            const newUser = new User({
                username: username,
                email: email,
                password: hashedPassword,
            });
            console.log(newUser);
            const result = await newUser.save();
    
            res.status(200).send(result);
        }else{
                res.status(400).send({message: 'Address email already exists'})
            }
        }else {
            res.status(400).send('All parameters is required !')
        }
    }catch (error) {
            res.status(400).send({'error': error})
        }
   
});

module.exports=router;
