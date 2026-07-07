const express= require('express');
const bcrypt = require('bcrypt')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const pool=require('../config/db')
const app=express();
const authenticateToken=require('../middleware/auth');
const router=express.Router();

router.post("/register",async(req,res)=>{
    try{
        const {email,password} = req.body;
        const HashedPassword = await bcrypt.hash(password,10);
        const insertQuery = `INSERT INTO users (email,password_hash,is_verified) VALUES ($1,$2,TRUE) RETURNING id,email,role,is_verified,created_at`;
        const values=[email,HashedPassword];
        const result = await pool.query(insertQuery,values);
        const user = result.rows[0];
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(201).json({
            message:"User registered successfully!",
            token,
            user
        });}
    catch(error){
        console.error('❌ Error registering user:', error);
        if(error.code === '23505'){
            res.status(400).json({error:"Email already exists"});
        }else{
            res.status(500).json({error
                :"Internal server error"
            });
        }
        }
    });

router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const findUserQuery =`SELECT id,email,password_hash,role,is_verified,created_at FROM users WHERE email=$1`;
        const result =await pool.query(findUserQuery,[email]);
        if(result.rows.length === 0){
            return res.status(401).json({
                error:"unauthorized: invalid email or password"
            })
        }
        const user =result.rows[0];

        const isPasswordValid = await bcrypt.compare(password,user.password_hash);
        if(!isPasswordValid){
            return res.status(401).json({
                error:"unauthorized: invalid email or password"
            })}
        if (!user.is_verified) {
            return res.status(403).json({
                error:"account is not verified yet"
            });
        }

        const token= jwt.sign(
                    {id:user.id,role:user.role},
                    process.env.JWT_SECRET,
                    {expiresIn:'1h'}
                        );
        res.status(200).json({
            message:"Login successfull!",
            token:token,
            user:{
                id:user.id,
                email:user.email,
                role:user.role,
                is_verified: user.is_verified,
                created_at:user.created_at
            }
        })
        }
    catch(error){
    console.error('❌ Error during login:', error);
    res.status(500).json({
        error:"Internal server error"
    })}
})

router.get("/profile",authenticateToken,(req,res)=>{
    return res.status(200).json({
        message:"welcometo the vip room!",
        user_data:req.user
    });
});

module.exports=router;