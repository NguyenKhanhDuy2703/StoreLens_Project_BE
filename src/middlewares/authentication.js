const {verifyToken} = require('../utils/handleToken')
 require('dotenv').config();
// Desc: Middleware to check if user is logged in
const authenticationToken  = async(req, res, next) => {
    var token = req.cookies.sessionToken;
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }
    req.data = token;
    next();
}
const authenticatioRole = ( role) =>{
    return (req, res, next) => {
        const Currtoken = req.data;
        const user = verifyToken(Currtoken);
        if(!role.includes(user.role.toLowerCase())){
            return res.status(403).json({message: 'Forbidden'});
        } 
        req.data = user;
        next();
    }
}

module.exports = {authenticationToken , authenticatioRole};
