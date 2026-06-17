const express= require('express');
const {Pool} = require('pg');
const bcrypt = require('bcrypt')

const app=express();

const PORT=3001;

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'auth_db',
    password: 'Tan@0803',
    port: 5432,
});


pool.connect((err, client, release) => {
    if(err){
        console.error(`failed to connect to the database:${err}`);
    }else{
        console.log("🟢 Connected to the database successfully");
        release();
    }
});
app.use(express.json());

app.get("/health",(req,res)=>{
     res.json({
        service:"Auth Service",
        status:"active and ready",
        timestamp:new Date().toISOString()
     });
})



app.get("/welcome",(req,res)=>{
    res.json({
      message:"welcome to our e-commerce website!",
    });
})


app.post("/register",async(req,res)=>{
    try{
        const {email,password} = req.body;
        const HashedPassword = await bcrypt.hash(password,10);
        const insertQuery = `INSERT INTO users (email,password_hash) VALUES ($1,$2) RETURNING id,email,role,created_at`;
        const values=[email,HashedPassword];
        const result = await pool.query(insertQuery,values);
        res.status(201).json({
            message:"User registered successfully!",
            user: result.rows[0]
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
app.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const findUserQuery =`SELECT * FROM users WHERE email=$1`;
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
        res.status(200).json({
            message:"Login successfull!",
            user:{
                id:user.id,
                email:user.email,
                role:user.role,
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


app.listen(PORT,()=>{
    console.log(`🟢 Auth Service is running on http://localhost:${PORT}`)
});