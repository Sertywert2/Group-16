const authController = require('../controllers/authController');

module.exports = {
    '/login': {
        'GET': authController.showLoginForm,
        'POST': authController.handleLogin
    },
    '/logout': {
        'POST': authController.handleLogout
    }
};
