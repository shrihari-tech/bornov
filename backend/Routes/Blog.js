const express = require('express');
const router = express.Router();
const Blog = require('../Schema/Blog');
const { body, validationResult } = require('express-validator');

// Create a new blog post
router.post(
    '/postBlog',
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('content').notEmpty().withMessage('Content is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, content, author, createdAt } = req.body;
            const newBlog = new Blog({
                title,
                content,
                author,
                createdAt
            });
            const savedBlog = await newBlog.save();
            res.status(201).json(savedBlog);
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Get all blog posts of the logged-in user
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getBlog/:id', async (req, res) => {
    try {
        const  id  = req.params.id;
        const blog = await Blog.find({author:id});
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Edit a blog post by blogId
router.put(
    '/editBlog/:blogId',
    [
        body('title').optional().notEmpty().withMessage('Title cannot be empty'),
        body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { blogId } = req.params;
            const { title, content } = req.body;
            const blog = await Blog.findByIdAndUpdate({ _id: blogId});
            if (!blog) {
                return res.status(404).json({ error: 'Blog not found or unauthorized' });
            }
            if (title) blog.title = title;
            if (content) blog.content = content;
            const updatedBlog = await blog.save();
            res.status(200).json(updatedBlog);
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Delete a blog post
router.delete('/deleteBlog/:blogId',async (req, res) => {
    try {
        const blogId  = req.params.blogId;

        const blog = await Blog.findByIdAndDelete(blogId);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found or unauthorized' });
        }

        res.status(200).json({ message: 'Blog deleted successfully' });
    }    
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

