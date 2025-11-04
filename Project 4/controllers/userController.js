// controllers/userController.js

const User = require('../models/user');
const Item = require('../models/item');
const bcrypt = require('bcrypt');

// Sign up form
exports.signupForm = (req, res) => res.render('user/new');

// Sign up logic
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = new User({ firstName, lastName, email, password });
        await user.save();
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/users/login');
    } catch (error) {
        req.flash('error', 'Error creating account. Email may already be in use.');
        res.redirect('back');
    }
};

// Login form
exports.loginForm = (req, res) => res.render('user/login');

// Login logic
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        req.flash('success', 'Logged in successfully!');
        res.redirect('/users/profile');
    } else {
        req.flash('error', 'Invalid email or password');
        res.redirect('back');
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('back');
        res.redirect('/');
    });
};

// Profile
exports.profile = (req, res, next) => {
    const userId = req.session.user._id; 

    Promise.all([
        User.findById(userId),          
        Item.find({ seller: userId })      
    ])
    .then(results => {
        const [user, items] = results;
        res.render('user/profile', { user, items });
    })
    .catch(err => next(err));
};

// exports.profile = (req, res) => res.render('user/profile', { user: req.session.user });
