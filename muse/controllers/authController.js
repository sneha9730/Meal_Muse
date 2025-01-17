const User = require('../models/User');
const bcrypt = require('bcrypt');

const { ObjectId } = require('mongodb'); // Added for ObjectId usage
const jwt = require('jsonwebtoken'); // Importing JWT

// Login Logic
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userCollection.findOne({ email });
        if (!user) return res.status(404).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send('Invalid credentials');

        // Generate a token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            token // Send the token in response
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Signup Logic
const signupUser = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) return res.status(400).send('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, password: hashedPassword, name };
        await userCollection.insertOne(newUser);
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
};

module.exports = { loginUser, signupUser };
