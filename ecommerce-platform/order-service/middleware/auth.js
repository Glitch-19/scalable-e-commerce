const jwt=require('jsonwebtoken');
const verifyToken=(req,res,next)=>{
    const authHeader =req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({error:"You are not authenticated!"});
    }
    try{
        const cleanToken=token.replace("Bearer","");
        const verified= jwt.verify(cleanToken,process.env.JWT_SECRET); 
        req.user=verified;
        next();
    }catch(error){
        res.status(400).json({error:"invalid token!"});
    }
};
module.exports=verifyToken;