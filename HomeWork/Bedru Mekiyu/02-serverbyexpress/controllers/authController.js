// controllers/authController.js
const path = require('path');

const users = [
  { username: 'admin', password: 'secret' },
  { username: 'user', password: '1234' }
];

exports.showLoginForm = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
};

exports.handleLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

exports.handleLogout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};
