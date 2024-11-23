const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create a new post
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const post = new Post({
      title,
      content,
      authorId: req.user.id, // Use the authenticated user's ID
    });
    await post.save();

    // Populate author details to return a complete post object
    const populatedPost = await post.populate(
      "authorId",
      "username profileImage"
    );
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Error creating post" });
  }
});

// Get all posts or posts by a specific author
router.get("/", async (req, res) => {
  const { author, search } = req.query;

  try {
    // Filter by authorId if `author` query param is provided
    const filter = {};

    if (author) {
        const cleanAuthor = author.trim();
        console.log("Author Query:", cleanAuthor);
      if (!mongoose.isValidObjectId(cleanAuthor)) {
        console.error(`Invalid ObjectId: ${cleanAuthor}`);
        return res.status(400).json({ message: "Invalid author ID" });
      }
      console.log("Valid ObjectId: Proceeding to use.");
      filter.authorId = new mongoose.Types.ObjectId(cleanAuthor);

    } else {
      console.error("Author ID is missing or invalid.");
    }

    // Search for title containing the search query
    if (search) {
      filter.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    const posts = await Post.find(filter)
      .populate("authorId", "username profileImage") // Populate author details
      .sort({ createdAt: -1 }); // Sort by newest posts first

    const formattedPosts = posts.map((post) => ({
      postId: post._id, // Rename _id to id
      title: post.title,
      content: post.content,
      author: {
        id: post.authorId._id,
        username: post.authorId.username, // Use name or fallback to username
        profileImage: post.authorId.profileImage,
      },
      createdAt: post.createdAt,
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Get a specific post by its ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the post by its ID and populate author details
    const post = await Post.findById(id).populate(
      "authorId",
      "username profileImage"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
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
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Get posts for the logged-in user
router.get("/users/me/posts", authMiddleware, async (req, res) => {
  try {
    // Fetch posts created by the logged-in user
    const posts = await Post.find({ authorId: req.user.id })
      .populate("authorId", "username profileImage") // Include author's details if needed
      .sort({ createdAt: -1 }); // Sort by newest first

    const formattedPosts = posts.map((post) => ({
      postId: post._id,
      title: post.title,
      content: post.content,
      author: {
        id: post.authorId._id,
        username: post.authorId.username,
        profileImage: post.authorId.profileImage,
      },
      createdAt: post.createdAt,
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ message: "Error fetching user posts" });
  }
});

module.exports = router;
