const mongoose = require('mongoose');
const CartSchema = mongoose.Schema({
    itemId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
});

module.exports = mongoose.model('Carts', CartSchema);
