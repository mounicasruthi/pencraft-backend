// const express = require('express');
// const Post = require('../models/Post');
// const authMiddleware = require('../middleware/authMiddleware');
// const router = express.Router();

// router.post('/', authMiddleware, async (req, res) => {
//     const { title, content } = req.body;

//     if (!title || !content)
//         return res.status(400).json({ message: 'Title and content are required' });

//     try {
//         const post = new Post({ title, content, authorId: req.user.id });
//         await post.save();
//         res.status(201).json(post);
//     } catch (err) {
//         res.status(500).json({ message: 'Error creating post' });
//     }
// });

// router.get('/', async (req, res) => {
//     const { author } = req.query;

//     try {
//         const filter = author ? { authorId: author } : {};
//         const posts = await Post.find(filter).populate('authorId', 'email');
//         res.json(posts);
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching posts' });
//     }
// });

// module.exports = router;

const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        const post = new Post({ 
            title, 
            content, 
            authorId: req.user.id // Use the authenticated user's ID
        });
        await post.save();

        // Populate author details to return a complete post object
        const populatedPost = await post.populate('authorId', 'name profileImage');
        res.status(201).json(populatedPost);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ message: 'Error creating post' });
    }
});

// Get all posts or posts by a specific author
router.get('/', async (req, res) => {
    const { author } = req.query;

    try {
        // Filter by authorId if `author` query param is provided
        const filter = author ? { authorId: author } : {};
        const posts = await Post.find(filter)
            .populate('authorId', 'name profileImage') // Populate author details
            .sort({ createdAt: -1 }); // Sort by newest posts first

            const formattedPosts = posts.map((post) => ({
                postId: post._id, // Rename _id to id
                title: post.title,
                content: post.content,
                author: post.authorId,
                createdAt: post.createdAt,
            }));

        res.json(formattedPosts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// Get a specific post by its ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the post by its ID and populate author details
        const post = await Post.findById(id).populate('authorId', 'name profileImage');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Return the post with formatted data
        res.json({
            postId: post._id, 
            title: post.title,
            content: post.content,
            author: post.authorId,
            createdAt: post.createdAt,
        });
    } catch (err) {
        console.error('Error fetching post:', err);
        res.status(500).json({ message: 'Error fetching post' });
    }
});


// Get posts for the logged-in user
router.get('/user/posts', authMiddleware, async (req, res) => {
    try {
        // Fetch posts created by the logged-in user
        const posts = await Post.find({ authorId: req.user.id })
            .populate('authorId', 'name profileImage') // Include author's details if needed
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json(posts); // Return posts for the logged-in user
    } catch (err) {
        console.error('Error fetching user posts:', err);
        res.status(500).json({ message: 'Error fetching user posts' });
    }
});



module.exports = router;
