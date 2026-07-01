const jwt=require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req,res,next){
   let authheader= req.headers['authorization'];
   let token= authheader && authheader.split(' ')[1];
   if(!token){
    return res.status(401).json({
        error:"Access Denied"
    })
   }
   jwt.verify(token ,process.env.JWT_SECRET,(err,user)=>{
    if(err){
        return res.status(403).json({
            error:"Invalid token"
        })
    }
    req.user=user;
    next(); 
   })
}

module.exports=authenticateToken;