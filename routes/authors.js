const express = require("express");
const User = require("../models/User"); 
const router = express.Router();

// Fetch all authors
router.get("/", async (req, res) => {
    try {
        // Fetch users and include only necessary fields
        const authors = await User.find({}, "username _id profileImage");
        const formattedAuthors = authors.map((author) => ({
            authorId: author._id, // Map `_id` to `id` for frontend consistency
            username: author.username,
            profileImage: author.profileImage,
        }));
        res.json(formattedAuthors);
    } catch (err) {
        console.error("Error fetching authors:", err);
        res.status(500).json({ message: "Error fetching authors" });
    }
});

module.exports = router;
