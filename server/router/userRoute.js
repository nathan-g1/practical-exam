const express = require('express');
const router = express.Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_KEY || 'secretkey';

router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save();
        const token = await user.generateAuthToken();
        return res.status(200).json({
            message: 'user registered',
            token: token,
            user: user
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ 'username': req.body.username });
        if (!user) return res.status(400).json({ error: 'Invalid login credentials' })
        if (user.password !== req.body.password) return res.status(400).json({ error: 'Invalid login credentials' })
        const token = user.generateAuthToken();
        return res.status(200).json({
            message: 'success',
            token: token,
            user: user
        });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
});

module.exports = router;
