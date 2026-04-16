const BlogPost = require('../models/BlogPost');

exports.getBlogPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, featured } = req.query;
    
    const query = { active: true };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content') // Don't send full content in list
      .lean();

    const total = await BlogPost.countDocuments(query);

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await BlogPost.findOneAndUpdate(
      { slug, active: true },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category', { active: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
