const mongoose = require('mongoose');
const ItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'new Item'
    },
    price: {
        type: Number,
        required: true,
        default: 1230
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
    },
    description: {
        type: String,
        required: false
    },
    vendorName: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Items', ItemSchema);
