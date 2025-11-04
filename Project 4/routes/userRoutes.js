// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middleware/auth');

// Routes for users
router.get('/signup', isGuest, userController.signupForm);
router.post('/signup', isGuest, userController.signup);
router.get('/login', isGuest, userController.loginForm);
router.post('/login', isGuest, userController.login);
router.get('/logout', isLoggedIn, userController.logout);
router.get('/profile', isLoggedIn, userController.profile);

module.exports = router;
