const fs = require('fs');
const path = require('path');
const qs = require('querystring');

const showLoginForm = (req, res) => {
    const filePath = path.join(__dirname, '../views/login.html');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading login page');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
};

const handleLogin = (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const parsed = qs.parse(body);
        const { username, password } = parsed;

        if (username === 'admin' && password === '1234') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Login Successful');
        } else {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Invalid credentials');
        }
    });
};

const handleLogout = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Logged out successfully');
};

module.exports = {
    showLoginForm,
    handleLogin,
    handleLogout
};
