const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getBlogPosts);
router.get('/categories', blogController.getCategories);
router.get('/:slug', blogController.getBlogPostBySlug);

module.exports = router;
