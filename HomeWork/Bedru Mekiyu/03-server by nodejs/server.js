const http = require('http');
const url = require('url');
const fs = require('fs');
const authRoutes = require('./routes/authRoutes');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    // Basic Routing Logic
    if (authRoutes[path] && authRoutes[path][method]) {
        authRoutes[path][method](req, res);
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
