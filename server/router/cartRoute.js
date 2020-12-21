const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../model/Cart');
const Item = require('../model/Item');
const secretKey = process.env.JWT_KEY || 'secretkey';

router.get('/all', ensureToken, async (req, res) => {
    try {
        jwt.verify(req.token, secretKey, async (err, data) => {
            if (err) return res.sendStatus(403);
            const carts = await Cart.find();
            return res.json({ count: carts.length, carts: carts });
        });
    } catch (err) {
        return res.send({ message: err.message });
    }
});

router.get('/detail/:id', ensureToken, async (req, res) => {
    try {
        jwt.verify(req.token, secretKey, async (err, data) => {
            if (err) return res.sendStatus(403);
            const cart = await Cart.findOne({ _id: req.params.id });
            const item = await Item.findOne({ _id: cart.itemId });
            const cartDetail = {
                cart: cart,
                item: item
            };
            return res.json({ cart: cartDetail });
        });
    } catch (err) {
        return res.send({ message: err.message });
    }
});

router.post('/add', ensureToken, async (req, res) => {
    try {
        jwt.verify(req.token, secretKey, async (err, data) => {
            if (err) return res.sendStatus(403);
            const cart = [];
            const arr = req.body.carts;
            arr.forEach(element => {
                const item = new Cart({
                    itemId: element.itemId,
                    quanity: element.quanity
                });
                cart.push(element);
            });

            await Cart.insertMany(cart, (err, docs) => { });
            return res.json({ message: `${arr.length} carts added` });
        });
    } catch (err) {
        return res.send({ message: err });
    }
});

router.put('/update/:id', ensureToken, async (req, res) => {
    try {
        jwt.verify(req.token, secretKey, async (err, data) => {
            if (err) return res.sendStatus(403);
            const cart = await Cart.findOne({ _id: req.params.id });
            cart.itemId = req.body.itemId ? req.body.itemId : cart.itemId;
            cart.quantity = req.body.quantity ? req.body.quantity : cart.quantity;
            await Cart.findByIdAndUpdate({ _id: req.params.id }, cart);
            return res.json({ message: 'cart updated successfully', cart: cart });
        });
    } catch (err) {
        return res.send({ message: err.message });
    }
});

router.delete('/delete/:id', ensureToken, async (req, res) => {
    try {
        jwt.verify(req.token, secretKey, async (err, data) => {
            if (err) return res.sendStatus(403);
            const cart = await Cart.findById({ _id: req.params.id });
            await Cart.findByIdAndDelete({ _id: req.params.id });
            return res.json({ message: "successfully deleted", cart: cart });
        });
    } catch (err) {
        return res.send({ message: err.message });
    }
});

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = router;
