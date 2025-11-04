const { DateTime } = require("luxon");
const {v4: uuidv4} = require('uuid');

const items = [
    {
      id: '1',
      title: 'UAD Audio Apollo Kit',
      seller: 'Amare Cooper',
      condition: 'New',
      price: 2199.99,
      details: 'The world\'s most acclaimed Thunderbolt and USB audio interface. Get superior audio conversion, UAD plugins, and real-time workflow.',
      image: '/images/items/UAD-audio-apollo.png',
      active: true
    },
    {
      id: '2',
      title: 'Focusrite Scarlett Solo',
      seller: 'Jordan Lee',
      condition: 'Used',
      price: 1249.99,
      details: 'Compact USB audio interface with high-quality preamps for vocal and instrument recording. Ideal for home studios.',
      image: '/images/items/focusrite-scarlett-solo.png',
      active: true
    },
    {
      id: '3',
      title: 'sE Electronics X1 S Studio',
      seller: 'Nina Davis',
      condition: 'Like New',
      price: 249.99,
      details: 'High-performance large diaphragm condenser microphone with low self-noise. Perfect for studio recording.',
      image: '/images/items/sE-electronics-X1.png',
      active: true
    },
    {
      id: '4',
      title: 'KRK ROKIT 5 G4 Studio Monitors',
      seller: 'Sasha Williams',
      condition: 'Used',
      price: 338.00,
      details: 'Studio monitors with DSP-driven Graphic EQ, built-in Brickwall Limiter, and low-distortion Kevlar drivers.',
      image: '/images/items/krk-studio-monitor.jpg',
      active: true
    },
    {
      id: '5',
      title: 'Warm Audio Tube Channel Strip Bundle',
      seller: 'Eli Jones',
      condition: 'New',
      price: 2789.00,
      details: 'Premium tube-driven channel strip bundle with EQ and compression, ideal for high-end vocal and instrument recording.',
      image: '/images/items/channel-strip.png',
      active: true
    },
    {
      id: '6',
      title: 'A2e 64audio Custom In-ear Monitor',
      seller: 'Maya Thompson',
      condition: 'Like New',
      price: 799.00,
      details: 'Custom-fitted in-ear monitors designed for professional musicians, offering superior isolation and clarity.',
      image: '/images/items/a2e-64ears.png',
      active: true
    }
  ];

// Find all items
exports.find = () => items;

// Find item by ID
exports.findById = (id) => items.find(item => item.id === id);

// Save a new item
exports.save = (item) => {
    item.id = uuidv4();
    // item.createdAt = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
    item.title = item.title || 'Untitled Item';
    item.price = item.price || 0.00;
    item.condition = item.condition || 'Unknown';
    item.details = item.details || 'No details provided.';
    item.seller = item.seller || 'Unknown Seller';
    item.image = item.image || '/images/items/default-image.png';
    item.active = true;
    items.push(item);
};

// Update an item by ID
exports.updateById = (id, newItem) => {
    let item = items.find(item => item.id === id);
    if (item) {
        item.title = newItem.title;
        item.price = newItem.price;
        item.condition = newItem.condition;
        item.details = newItem.details;
        item.seller = newItem.seller;
        return true;
    }
    return false;
};

// Delete an item by ID
exports.deleteById = (id) => {
    let index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items.splice(index, 1);
        return true;
    }
    return false;
};
  