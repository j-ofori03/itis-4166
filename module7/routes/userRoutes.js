const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

// show the sign-up form
router.get('/new', controller.newUser);

// create a new user
router.post('/', controller.createUser);

// show the login form
router.get('/login', controller.loginForm);

// log in the user
router.post('/login', controller.loginUser);

// show the user profile
router.get('/profile', controller.profile);

// log out the user
router.get('/logout', controller.logout);

module.exports = router;
