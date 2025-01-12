const express = require('express');
const middleware = require('../middleware')
const sblog = require('../schema/blogSchema')
const User = require('../schema/userSchema');
const authMiddleware = require('../middleware');

const router = express.Router();

// post the blog
router.post('/sblog', middleware, async (req,res)=>{
    const UID = req.user.id; // Assuming this is the user's ID from the token

    try {
        // Correct query to find the user by ID
        const findUser = await User.findOne({ _id: UID });

        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const username = findUser.username; // Extract the correct username
        const blogId = req.user.id;

        const { title, blog } = req.body;

        if (!title || !blog) {
            return res.status(400).json({ message: 'Invalid Data' });
        }

        // Create a new blog post
        const newSblog = new sblog({
            title,
            blog,
            UID,
            username,
        });


        await newSblog.save(); // Save the blog to the database

        res.status(201).json({ message: 'Blog created successfully', newSblog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


router.get('/blog/:blogId', async (req, res) => {
    try {
        const blog = await sblog.findById(req.params.blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a blog by ID
router.delete('/blog/:blogId',middleware, async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await sblog.findByIdAndDelete(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/blog/:blogId', middleware, async (req,res) => {
    try {
        const { blogId } = req.params;
        const {title, blog } = req.body;
        
        const updatedBlog = await sblog.findOneAndUpdate(
            {_id:blogId, UID :req.user.id},
            {title, blog},
            {new:true}
        )

        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found or unauthorized' });
        }

        res.status(200).json({ message: 'Blog updated successfully', updatedBlog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post('/blog/:blogId/like', authMiddleware, async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        const blog = await sblog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.likedBy.includes(userId)) {
            return res.status(400).json({ message: 'You already liked this blog' });
        }

        blog.likes += 1;
        blog.likedBy.push(userId);
        await blog.save();

        res.status(200).json({ message: 'Blog liked successfully', likes: blog.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/blogs', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const blogs = await sblog
            .find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalBlogs = await sblog.countDocuments();
        res.status(200).json({ blogs, totalPages: Math.ceil(totalBlogs / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/blogs', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const blogs = await sblog
            .find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalBlogs = await sblog.countDocuments();
        res.status(200).json({ blogs, totalPages: Math.ceil(totalBlogs / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/blogs/search', async (req, res) => {
    const { query } = req.query;

    try {
        const blogs = await sblog.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { blog: { $regex: query, $options: 'i' } },
            ],
        });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





module.exports = router;