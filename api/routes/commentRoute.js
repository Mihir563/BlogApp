const express = require('express');
const User = require('../schema/userSchema')
const Comment = require('../schema/commentScehma')
const sblog = require('../schema/blogSchema')
const middleware = require('../middleware');
const router = express.Router()

router.post('/comments/:blogId', middleware, async (req,res) => {
    try {
        const UID = req.user.id;
        
        const userid = req.user._id;
        const findUser = await User.findOne(userid)
        const username = findUser.username;
        const {comment} = req.body;
        const blog = await sblog.findById(req.params.blogId);
        const blogId = blog.id;
        console.log(username);
        
        
        const newComment = new Comment({
            comment,
            username,
            UID,
            blogId
        })

        await newComment.save();
        res.status(201).json({message :"added comment to the post"})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})

router.get('/comments/:blogId',middleware, async (req, res) => {
    try {
        const { blogId } = req.params; // Get the blogId from the URL
        const blog = await sblog.findById(blogId); // Find the blog by ID
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // Fetch comments associated with the blogId
        const comments = await Comment.find({ blogId });

        res.status(200).json({ blog, comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;