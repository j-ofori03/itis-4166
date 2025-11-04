// middleware/fileUpload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images'); // specify the folder for storing uploaded images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Save the image with a unique name
    }
});

const fileFilter = (req, file, cb) => {
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (mimeTypes.includes(file.mimetype)) {
        cb(null, true); // accept file if it matches allowed mime types
    } else {
        cb(new Error('Invalid file type. Only jpg, jpeg, png, and gif image files are allowed.'));
    }
};

exports.upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // limit file size, 2MB
}).single('image'); // accept only a single file for the field 'image'
