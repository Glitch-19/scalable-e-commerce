const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();


app.use((req, res, next) => {
    console.log('GATEWAY:', req.method, req.originalUrl);
    next();
});

app.use('/auth', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/auth': ''
    }
}));

app.use('/product-service', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/product-service': ''
    }
}));

app.listen(3000, () => {
    console.log('Gateway running on port 3000');
});