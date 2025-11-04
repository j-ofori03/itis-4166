// middleware/auth.js
const Item = require('../models/item')

exports.isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error', 'Please log in to view this page.');
    res.redirect('/users/login');
};

exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    req.flash('error', 'You are already logged in.');
    res.redirect('/users/profile');
};

exports.isSeller = (req, res, next) => {
    const itemId = req.params.id || req.params.itemId;

    Item.findById(itemId)
        .then(item => {
            if (item) {
                if (item && item.seller.toString() === req.session.user._id.toString()) {
                    return next();
                } else {
                    const err = new Error('Unauthorized access: contact the seller of this item.');
                    err.status = 401;
                    req.flash('error', 'Unauthorized access: contact the seller');
                    res.redirect('/items');
                    return next(err);
                }
            } else {
                const err = new Error('Item not found.');
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => {
            return next(err);
        });
};

