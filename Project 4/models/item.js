const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: 'Unknown Seller'
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Used', 'Like New', 'Refurbished']
    },
    price: {
      type: Number,
      required: true,
      min: [0.01, 'Price must be at least 0.01']
    },
    details: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      default: '/images/items/default-image.png'
    },
    active: {
      type: Boolean,
      default: true
    }
  }, {
    timestamps: true // createdAt and updatedAt timestamps
  });
  
  module.exports = mongoose.model('Item', itemSchema);