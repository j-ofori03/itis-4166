const User = require('../models/user');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

// sign-up form
exports.newUser = (req, res) => {
    res.render('user/new');
};

// new user
exports.createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();
        req.flash('success', 'User created successfully!');
        res.redirect('/users/login');
    } catch (err) {
        console.error(err);
        res.render('user/new', { errors: err.errors });
    }
};

// login form
exports.loginForm = (req, res) => {
    res.render('user/login');
};

// log in user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    // const email = req.body.email;
    // const password = req.body.password;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.flash('success', 'login successfull!');
        return res.redirect('/users/profile');
    }
    req.flash('error', 'Invalid email address or password.');
    res.redirect('/users/login');
};

// user profile
exports.profile = (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }
    User.findById(req.session.userId)
        .then(user => {
            res.render('user/profile', { user });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/'); // Redirect to home on error
        });
};

// Log off user
exports.logout = (req, res) => {
    req.session.destroy(err => {
        req.flash('success', 'logoff successfull!');
        if (err) {
            console.error(err);
            return res.redirect('/users/profile');
        }
        req.flash('success', 'logoff successfull!');
        res.redirect('/');
    });
};


