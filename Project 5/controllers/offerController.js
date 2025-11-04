const Offer = require('../models/offer');
const Item = require('../models/item');

// Make an offer
exports.makeOffer = async (req, res, next) => {
    const { itemId } = req.params;
    const { amount } = req.body;

    try {
        if (!req.session.user) {
            req.flash('error', 'Please log in to make an offer.');
            return res.redirect('/users/login');
        }

        const item = await Item.findById(itemId);
        if (!item) {
            let err = new Error('Item not found');
            err.status = 404;
            throw err;
        }

        if (item.seller.toString() === req.session.user._id.toString()) {
            req.flash('error', 'You cannot make an offer on your own item.');
            return res.redirect(`/items/${itemId}`);
        }

        // Create new offer
        const offer = new Offer({
            amount,
            item: itemId,
            user: req.session.user._id,
        });

        await offer.save();

        // Update item statistics
        const highestOffer = Math.max(item.highestOffer, amount);
        await Item.findByIdAndUpdate(itemId, {
            $inc: { totalOffers: 1 },
            $set: { highestOffer },
        }, { new: true });

        req.flash('success', 'Offer made successfully!');
        res.redirect(`/items/${itemId}`);
    } catch (err) {
        next(err);
    }
};

// View all offers on an item
// Handle viewing all offers on an item
exports.viewOffers = async (req, res, next) => {
    const { itemId } = req.params;

    try {
        // Find the item
        const item = await Item.findById(itemId).populate('seller');
        if (!item) {
            req.flash('error', 'Item not found.');
            return res.redirect('back');
        }

        // Get all offers for the item
        const offers = await Offer.find({ item: itemId }).populate('user', 'firstName lastName');
        
        // Render the list of offers for the item
        res.render('offer/offers', { offers, item });
    } catch (err) {
        next(err);
    }
};

// Handle accepting an offer
exports.acceptOffer = (req, res, next) => {
    const { itemId, offerId } = req.params;

    Offer.findById(offerId)
        .then(offer => {
            if (!offer) {
                throw new Error('Offer not found');
            }

            return Item.findById(itemId);
        })
        .then(item => {
            if (!item || item.seller.toString() !== req.session.user._id.toString()) {
                throw new Error('Unauthorized to accept this offer');
            }

            // Redirect to item detail view
            res.redirect(`/items/${itemId}`);
        })
        .catch(next);
};


