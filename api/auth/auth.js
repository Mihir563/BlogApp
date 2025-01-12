const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schema/userSchema');
const dotenv = require('dotenv');

dotenv.config(); // Ensure dotenv is loaded

const jwtKey = process.env.JWT_KEY;
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if user already exists
        const userExist = await User.findOne({ username });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashPass = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashPass,
            email,
        });

        // Save the user in the database
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ id: newUser._id }, jwtKey, { expiresIn: "7d" });

        // Send the response with the token
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Error in /register:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // Compare the password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, jwtKey, { expiresIn: "7d" });

        // Send the response with the token
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in /login:", error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
