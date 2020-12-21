const express = require('express');
const router = express.Router();
const Item = require('../model/Item');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/ImageUpload');
const secretKey = process.env.JWT_KEY || 'secretkey';
const PAGE_LIMIT = 5;

router.get('/all/:page', ensureToken, async (req, res) => {
    try {
        jwt.verify(req.token, secretKey, (err, data) => {
            if (err) return res.sendStatus(403);
            const limit = PAGE_LIMIT;
            const page = Math.max(0, req.params.page);
            const items = Item.find({ isAvailable: true })
                .sort({ price: 'asc' })
                .limit(limit)
                .skip(limit * page)
                .then(results => {
                    return res.json({ count: items.length, items: results });
                })
                .catch((err) => {
                    return res.status(500).send(err.message);
                });
        });
    } catch (err) {
        res.send({ message: err.message });
    }
});

router.get('/detail/:id', ensureToken, async (req, res) => {
    try {
        jwt.verify(req.token, secretKey, async (err, data) => {
            if (err) return res.sendStatus(403);
            const item = await Item.find({ _id: req.params.id });
            return res.json(item);
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
})

router.post('/add', async (req, res) => {
    try {
        jwt.verify(req.token, secretKey, async (err, data) => {
            if (err) return res.sendStatus(403);
            const items = [];
            const arr = req.body.items;
            arr.forEach(element => {
                const item = new Item({
                    name: element.name,
                    price: element.price,
                    model: element.model,
                    isAvailable: element.isAvailable,
                    image: element.image,
                    deleted: element.deleted,
                    description: element.description,
                    vendorName: element.vendorName
                });
                items.push(element);
            });

            const newItems = await Item.insertMany(items, (err, docs) => { });
            return res.json({ message: 'success', newItems: arr })
        });
    } catch (err) {
        return res.send({ message: err.message });
    }
});

router.put('/update/:id', ensureToken, upload.single('image'), async (req, res) => {
    try {
        jwt.verify(req.token, secretKey, async (err, data) => {
            if (err) return res.sendStatus(403);
            if (req.file !== undefined) req.body.image = req.file.path;
            const item = await Item.findOne({ _id: req.params.id });
            item.image = req.body.image;
            item.name = req.body.name ? req.body.name : item.name;
            item.price = req.body.price ? req.body.price : item.price;
            item.isAvailable = req.body.isAvailable ? req.body.naisAvailableme : item.isAvailable;
            item.deleted = req.body.deleted ? req.body.deleted : item.deleted;
            item.description = req.body.description ? req.body.description : item.description;
            item.vendorName = req.body.vendorName ? req.body.vendorName : item.vendorName;

            await Item.findByIdAndUpdate({ _id: req.params.id }, item);
            const _updatedItem = await Item.findOne({ _id: req.params.id });
            return res.json(_updatedItem);
        });
    } catch (err) {
        return res.json({ message: err.message });
    }
});

router.delete('/delete/:id', ensureToken, async (req, res) => {
    try {
        jwt.verify(req.token, secretKey, async (err, data) => {
            if (err) return res.sendStatus(403);
            const item = await Item.findById({ _id: req.params.id });
            await Item.findByIdAndDelete({ _id: req.params.id });
            return res.json({ Item: "successfully deleted", item: item });
        });
    } catch (err) {
        return res.json({ message: err.message });
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
