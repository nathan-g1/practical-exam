const mongoose = require('mongoose');
const Item = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        required: false
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true
    },
    image: {
        type: String,
        required: false
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Item', Item);

