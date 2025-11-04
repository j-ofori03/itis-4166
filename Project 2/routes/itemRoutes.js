const express = require('express');
const controller = require('../controllers/itemController');

const router = express.Router();

// GET /items: Send all items
router.get('/', controller.index);

// GET /items/new: Send form to create a new item
router.get('/new', controller.new);

// POST /items: Create a new item
router.post('/', controller.create);

// GET /items/:id: Show a specific item
router.get('/:id', controller.show);

// GET /items/:id/edit: Send form to edit an item
router.get('/:id/edit', controller.edit);

// PUT /items/:id: Update a specific item
router.put('/:id', controller.update);

// DELETE /items/:id: Delete a specific item
router.delete('/:id', controller.delete);

// Route to get items with an optional search query
router.get('/items', controller.getItems); 

module.exports = router;
