const express = require('express');
const offerController = require('../controllers/offerController');
const { isLoggedIn, isSeller } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// POST /items/:itemId/offers: Make an offer
router.post('/', isLoggedIn, offerController.makeOffer);

// GET /items/:itemId/offers: View all offers on an item
router.get('/', isLoggedIn, isSeller, offerController.viewOffers);

// Profile
// router.get('/profile', isLoggedIn, offerController.viewProfile);

// PUT /items/:itemId/offers/:offerId/accept: Accept an offer
router.put('/:offerId/accept', isLoggedIn, isSeller, offerController.acceptOffer);

module.exports = router;
