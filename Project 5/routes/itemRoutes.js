const express = require('express');
const controller = require('../controllers/itemController');
const {isLoggedIn, isSeller} = require('../middleware/auth')
const offerRoutes = require('./offerRoutes');
const router = express.Router();

// GET /items: Send all items
router.get('/', controller.index);

// GET /items/new: Send form to create a new item
router.get('/new', isLoggedIn, controller.new);

// POST /items: Create a new item
router.post('/', isLoggedIn, controller.create);

// GET /items/:id: Show a specific item
router.get('/:id', controller.show);

// GET /items/:id/edit: Send form to edit an item
router.get('/:id/edit', isLoggedIn, isSeller, controller.edit);

// PUT /items/:id: Update a specific item
router.put('/:id', isLoggedIn, isSeller, controller.update);

// DELETE /items/:id: Delete a specific item
router.delete('/:id', isLoggedIn, isSeller, controller.delete);

// Route to get items with an optional search query
router.get('/items', controller.getItems); 

// Mount offers routes
router.use('/:itemId/offers', offerRoutes);

module.exports = router;
