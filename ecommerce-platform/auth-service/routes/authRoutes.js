const express= require('express');
const bcrypt = require('bcrypt')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pool=require('../config/db')
const app=express();
const authenticateToken=require('../middleware/auth');
const router=express.Router();

const isGmailEmail = (value) => /@gmail\.com$/i.test(String(value || "").trim());
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '74227941157-rnfin93c6vovmqfjvcaq4hdm0bh6gdai.apps.googleusercontent.com');

router.post("/register",async(req,res)=>{
    try{
        const {email,password} = req.body;
        if (!isGmailEmail(email)) {
            return res.status(400).json({ error: "Use a Gmail address to register" });
        }
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
        if (!isGmailEmail(email)) {
            return res.status(400).json({ error: "Use a Gmail address to login" });
        }
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

router.post("/google",async(req,res)=>{
    try{
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ error: "Missing Google credential" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID || '74227941157-rnfin93c6vovmqfjvcaq4hdm0bh6gdai.apps.googleusercontent.com'
        });

        const payload = ticket.getPayload();
        const email = payload?.email;

        if (!email || !payload?.email_verified) {
            return res.status(401).json({ error: "Google account is not verified" });
        }

        const existingUserResult = await pool.query(
            `SELECT id,email,password_hash,role,is_verified,created_at FROM users WHERE email=$1`,
            [email]
        );

        let user = existingUserResult.rows[0];

        if (!user) {
            const fallbackPasswordHash = await bcrypt.hash(`google:${email}`, 10);
            const insertResult = await pool.query(
                `INSERT INTO users (email,password_hash,is_verified,role) VALUES ($1,$2,TRUE,'Customer') RETURNING id,email,role,is_verified,created_at`,
                [email, fallbackPasswordHash]
            );
            user = insertResult.rows[0];
        } else if (!user.is_verified) {
            const updateResult = await pool.query(
                `UPDATE users SET is_verified=TRUE WHERE email=$1 RETURNING id,email,role,is_verified,created_at`,
                [email]
            );
            user = updateResult.rows[0];
        } else {
            user = {
                id: user.id,
                email: user.email,
                role: user.role,
                is_verified: user.is_verified,
                created_at: user.created_at
            };
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: "Google login successfull!",
            token,
            user
        });
    } catch(error) {
        console.error('❌ Error during Google login:', error);
        return res.status(500).json({ error: "Unable to authenticate Google account" });
    }
})

router.get("/profile",authenticateToken,(req,res)=>{
    return res.status(200).json({
        message:"welcometo the vip room!",
        user_data:req.user
    });
});

module.exports=router;