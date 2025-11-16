const  jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET} = process.env;

const renderToken =  (data) => {
    return  jwt.sign(data , JWT_SECRET, {expiresIn: '1h'});
}
const verifyToken =  (token) => {
   try{
    console.log("JWT_SECRET:", JWT_SECRET);
    const decode = jwt.verify(token, JWT_SECRET);
    return decode;
   }catch(error){
       console.log(error);
   }
}
module.exports = {
    renderToken , verifyToken
};
