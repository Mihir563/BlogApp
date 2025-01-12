const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    blog: { type: String, required: true },
    username: { type: String, required: true },
    UID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track users who liked the blog
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
