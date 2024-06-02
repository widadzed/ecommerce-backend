const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const ShoppingCart = require('../models/shoppingcart');




router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'user exist' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
       const savedUser = await  newUser.save();
       console.log(savedUser);
        const shoppingCart = new ShoppingCart({user: savedUser._id, items: [] });
       await shoppingCart.save();
        res.status(201).json({ message: 'registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error' });
    }
    
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'email is wrong ' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: ' wrong password' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, 'your_secret_key');
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
/*
app.get('/protected', authenticateToken, (req, res) => {
    // Only authenticated users can access this route
    res.json({ message: 'Protected route accessed' });
});*/