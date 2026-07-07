const express = require('express');

const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors()); // 👈 2. Open the VIP gates to let React (Port 5173) in!


app.use((req, res, next) => {
    console.log('GATEWAY:', req.method, req.originalUrl);
    next();
});

app.use('/auth', createProxyMiddleware({
    target: 'http://auth-service:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/auth': ''
    }
}));

app.use('/product-service', createProxyMiddleware({
    target: 'http://product-service:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/product-service': ''
    }
}));

app.use('/order-service', createProxyMiddleware({ 
    target: 'http://order-service:3003', 
    changeOrigin: true ,
    pathRewrite: {
        '^/order-service': ''
    }
}));

app.listen(3000, () => {
    console.log('Gateway running on port 3000');
});