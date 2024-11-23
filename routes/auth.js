const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Generate a hashed profile picture URL using Robohash
        const profileImage = `https://robohash.org/${encodeURIComponent(email)}.png`;

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the generated profile image
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            profileImage,
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        if (error.username === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });


        if (!user) return res.status(400).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
        res.json({ token });
    } catch (err) {
        console.error('Error in /login:', err);
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router;
