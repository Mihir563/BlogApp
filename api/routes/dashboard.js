const express = require('express');
const middleware = require('../middleware');
const sblog = require('../schema/blogSchema')
const router = express.Router();

router.get('/dashboard', middleware, async (req, res) => {
    try {
        const blogs = await sblog
            .find()
            .sort({ createdAt: -1 }) // Sort by newest first

        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error.message);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
