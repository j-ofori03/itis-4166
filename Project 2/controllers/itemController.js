const model = require('../models/item');
const { upload } = require('../middleware/fileUpload');

exports.index = (req, res) => {
    const searchTerm = req.query.search ? req.query.search.toLowerCase() : '';
    let items = model.find();

    // search term is present, filter items
    if (searchTerm) {
        items = items.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.details.toLowerCase().includes(searchTerm)
        );
    }

    // sort items by price, ascending order
    items.sort((a, b) => a.price - b.price);

    // filtered items exist, render the itemList page
    if (searchTerm) {
        res.render('./item/itemList', { items }); 
    } else {
        res.render('./item/index', { items });
    }
};

exports.new = (req, res) => {
    res.render('./item/new');
};

exports.create = (req, res) => {
    console.log(req.body); // Log form data
    console.log(req.file); // Log uploaded file, if using multer

    // let item = req.body;
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send(err.message); // Handle file upload errors
        }

        let item = {
            title: req.body.title,
            price: parseFloat(req.body.price),
            condition: req.body.condition,
            details: req.body.details,
            seller: req.body.seller || 'Unknown Seller',
            image: req.file ? '/images/' + req.file.filename : '/images/items/default-image.png', // Use uploaded image or default
            active: true
        };

        model.save(item); // Save the item
        res.redirect('/items');
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    let item = model.findById(id);
    if (item) {
        res.render('./item/item', { item });
    } else {
        let error = new Error('Cannot find an item with id ' + id);
        error.status = 404;
        next(error);
    }
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    let item = model.findById(id);
    if (item) {
        res.render('./item/edit', { item });
    } else {
        let error = new Error('Cannot find an item with id ' + id);
        error.status = 404;
        next(error);
    }
};

exports.update = (req, res, next) => {
    // let item = req.body;
    let item = {
        title: req.body.title,
        price: parseFloat(req.body.price), // Ensure price is converted to a number
        condition: req.body.condition,
        details: req.body.details,
        seller: req.body.seller
    };

    let id = req.params.id;
    if (model.updateById(id, item)) {
        res.redirect('/items/' + id);
    } else {
        let error = new Error('Cannot find an item with id ' + id);
        error.status = 404;
        next(error);
    }
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    if (model.deleteById(id)) {
        res.redirect('/items');
    } else {
        let error = new Error('Cannot find an item with id ' + id);
        error.status = 404;
        next(error);
    }
};

// Search function
exports.getItems = async (req, res, next) => {
    const searchTerm = req.query.search ? req.query.search.toLowerCase() : '';
    console.log(`Search term: ${searchTerm}`); 

    let items = await model.find(); 
    console.log(`All items: ${JSON.stringify(items)}`); 

    const filteredItems = [];

    items.forEach(item => {
        if (item.title.toLowerCase() === searchTerm) {
            filteredItems.push(item); 
        }
    });

    // check if filtered items exist
    if (filteredItems.length === 0) {
        console.log('No matching items found.');
        res.render('./item/itemList', { items: [], message: 'No items found.' });
    } else {
        console.log(`Filtered items: ${JSON.stringify(filteredItems)}`); 
        res.render('./item/itemList', { items: filteredItems });
    }
};











