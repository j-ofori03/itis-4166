const model = require('../models/item');
const Offer = require('../models/offer');
const { upload } = require('../middleware/fileUpload');

// all (searched) items
exports.index = (req, res, next) => {
    const searchTerm = req.query.search ? req.query.search.toLowerCase() : '';

    // query filter, only active items are retreived
    let filter = {
        active: true,
        $or: [
            { title: { $regex: searchTerm, $options: 'i' } }, // Case insensitive search
            { details: { $regex: searchTerm, $options: 'i' } }
        ]
    };

    // sort items by price, ascending
    model.find(filter)
        .sort({ price: 1 }) 
        .then(items => {
            if (searchTerm) {
                res.render('./item/itemList', { items });
            } else {
                res.render('./item/index', { items });
            }
        })
        .catch(err => next(err));
};

// new item
exports.new = (req, res) => {
    res.render('./item/new');
};

// create new item
exports.create = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send(err.message);
        }

        let item = new model({
            title: req.body.title,
            price: parseFloat(req.body.price),
            condition: req.body.condition,
            details: req.body.details,
            seller: req.session.user._id || 'Unknown Seller', // Save user ID (ObjectId)
            image: req.file ? '/images/' + req.file.filename : '/images/items/default-image.png', // Use uploaded image or default
            active: true
        });

        item.save()
            .then((item) => {
                req.flash('success', 'Item created successfully!');
                res.redirect('/items')
            })
            .catch(err => {
                if (err.name === 'ValidationError') {
                    err.status = 400;
                }
                next(err);
            });
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
        .populate('seller', 'firstName lastName')
        .then(item => {
            if (item) {
                res.render('./item/item', { item });
            } else {
                let err = new Error('Cannot find an item with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// edit item form
exports.edit = (req, res, next) => {
    let id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
        .then(item => {
            if (item) {
                res.render('./item/edit', { item });
            } else {
                let err = new Error('Cannot find an item with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// update an item
exports.update = (req, res, next) => {
    let id = req.params.id;
    let item = {
        title: req.body.title,
        price: parseFloat(req.body.price),
        condition: req.body.condition,
        details: req.body.details,
        seller: req.body.seller
    };

    // replace image or keep existing
    if (req.file) {
        item.image = '/images/' + req.file.filename;
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndUpdate(id, item, { useFindAndModify: false, runValidators: true })
        .then(item => {
            if (item) {
                req.flash('success', 'Item updated successfully!');
                res.redirect('/items/' + id);
            } else {
                let err = new Error('Cannot find an item with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

// delete an item
exports.delete = (req, res, next) => {
    let id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }

    // First, remove all offers associated with the item
    Offer.deleteMany({ item: id })
        .then(() => {
            // Then, delete the item itself
            return model.findByIdAndDelete(id, { useFindAndModify: false });
        })
        .then(item => {
            if (item) {
                req.flash('success', 'Item and associated offers deleted successfully!');
                res.redirect('/items');
            } else {
                let err = new Error('Cannot find an item with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};


// search items
exports.getItems = (req, res, next) => {
    const searchTerm = req.query.search ? req.query.search.toLowerCase() : '';
    console.log(`Search term: ${searchTerm}`);

    let filter = {
        active: true, 
        $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { details: { $regex: searchTerm, $options: 'i' } }
        ]
    };

    model.find(filter)
        .then(items => {
            if (items.length === 0) {
                console.log('No matching items found.');
                res.render('./item/itemList', { items: [], message: 'No items found.' });
            } else {
                console.log(`Filtered items: ${JSON.stringify(items)}`);
                res.render('./item/itemList', { items });
            }
        })
        .catch(err => next(err));
};

