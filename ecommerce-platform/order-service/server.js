const express=require('express');
const app=express();
require('dotenv').config();
const mongoose= require('mongoose');
const orderRoutes = require('./routes/orderRoutes');

app.use(express.json());
app.use('/orders', orderRoutes);
const PORT=3003;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("🟢 Connected to MongoDB successfully")})
.catch(err=>{console.error(`❌ Failed to connect to MongoDB: ${err}`)});

app.listen(PORT,()=>{
    console.log(`🟢 Order Service is running on http://localhost:${PORT}`);
})
