const mongoose=require('mongoose');
const express=require('express');
const app=express();
app.use(express.json());
require('dotenv').config();
const productroutes =require('./routes/productRoutes');
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
});
app.use('/products',productroutes);
const PORT=3002;
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("🟢 Connected to MongoDB successfully"))
.catch((err)=> console.error(`❌ Failed to connect to MongoDB: ${err}`));

app.get("/health",(req,res)=>{
    res.json({
        message:"product service is  active and ready"
            })
})
app.listen(PORT,()=>{
    console.log(`🟢 Product Service is running on http://localhost:${PORT}`);
}
)