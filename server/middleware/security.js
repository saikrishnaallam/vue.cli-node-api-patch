const jwt = require('jsonwebtoken')
require('dotenv/config');

module.exports.LoggedInAsUserRequired = (req, res, next)=>{ 
    if(req.user){
        next();
    }else{
        return res.sendStatus(403);
    }
}

module.exports.LoggedInAsAdminRequired = (req, res, next)=>{ 
    if(req.user.user.role==='ADMIN'){
        next();
    }else{
        return res.sendStatus(403);
    }
}

module.exports.FromJWT = async function(token) {
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;       
    } catch (error) {
        console.log({error});

        return null;
    }

}