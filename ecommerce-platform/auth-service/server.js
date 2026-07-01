const express= require('express');
require('dotenv').config();
const pool=require('./config/db')
const app=express();

const authRoutes=require('./routes/authRoutes');
const PORT=3001;

app.use(express.json());
app.use('/',authRoutes);
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

app.listen(PORT,()=>{
    console.log(`🟢 Auth Service is running on http://localhost:${PORT}`)
});