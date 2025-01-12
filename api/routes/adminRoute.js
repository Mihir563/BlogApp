const express = require('express')
const middleware = require('../middleware')
const Blog = require('../schema/blogSchema')
const User = require('../schema/userSchema')

const router = express.Router();    

router.get('/admin/:username', middleware, async (req, res) => {
    try {
        const username = req.params.username;

        // Fetch blogs for the given username
        const blogs = await Blog.find({ username });
        const Username = await User.findOne({ username });
        console.log(Username);
        

        if (!blogs || blogs.length === 0) {
            return res.status(200).json({
                message: 'No blogs found for this username.',
                blogs: [],
                Username, // Include user info even if no blogs exist
            });
        }

        res.status(200).json({blogs, Username});
    } catch (error) {
        console.error(`Error fetching blogs for username ${username}:`, error.message);
        res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
    }
});


router.put('/admin/profile', middleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from middleware
        const { username, email } = req.body;

        // Validate input
        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are required.' });
        }

        // Check if the username is already taken by another user
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser.id !== userId) {
            return res.status(400).json({ message: 'Username is already in use by another user.' });
        }

        // Update the user's profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true } // Return the updated document and validate changes
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: 'Profile updated successfully.',
            user: {
                username: updatedUser.username,
                email: updatedUser.email,
                createdAt: updatedUser.createdAt,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ message: 'Failed to update profile.', error: error.message });
    }
});




module.exports = router