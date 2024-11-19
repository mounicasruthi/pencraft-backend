const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content)
        return res.status(400).json({ message: 'Title and content are required' });

    try {
        const post = new Post({ title, content, authorId: req.user.id });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: 'Error creating post' });
    }
});

router.get('/', async (req, res) => {
    const { author } = req.query;

    try {
        const filter = author ? { authorId: author } : {};
        const posts = await Post.find(filter).populate('authorId', 'email');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

module.exports = router;
