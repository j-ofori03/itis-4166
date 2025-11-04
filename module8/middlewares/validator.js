// middlewares/validator.js
const mongoose = require('mongoose');

exports.validateId = (req, res, next) => {
    const id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
        next();
    } else {
        const err = new Error('Invalid Story ID');
        err.status = 400;
        next(err);
    }
};
