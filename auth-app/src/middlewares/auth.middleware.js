var jwt= require('jsonwebtoken');
var db=require('../../models');
require('dotenv').config({ path: '.env' });

exports.authMiddleware = (req , res , next )=>{
    const authHeader = req.headers.authorization;

    if(authHeader){
        const bearer = authHeader.split(' ');
        const bearerToken = bearer[1]

        if (bearerToken){
            jwt.verify(bearerToken, process.env.JWT_SECRET_KEY , async (err, data) => {
                if (err) {
                    return res.sendStatus(401);
                }
                const user = await db.User.findOne({
                    where:{id : data.userId},
                })
                if (user){
                    req.data = user;
                    next();
                }

            });
        }
    }else {
        return res.sendStatus(401);
    }
};


