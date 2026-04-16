const Game = require('../models/Game');
const Analytics = require('../models/Analytics');
const { getCache, setCache, deleteCache } = require('../services/cache');

const CATEGORIES = [
  'Action & Arcade',
  'Board Games',
  'Card & Solitaire',
  'Hidden Object',
  'Mahjong',
  'Match 3',
  'Multiplayer',
  'Puzzle',
  'Racing',
  'Sports',
  'Strategy & Simulation',
  'Word Games'
];

// GET /api/games - Paginated list
const getGames = async (req, res) => {
  try {
    const { page = 1, limit = 24, category, sort = 'stars', search, language, license } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const cacheKey = `games:${pageNum}:${limitNum}:${category || ''}:${sort}:${search || ''}:${language || ''}:${license || ''}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    // Build query
    const query = { active: true };
    if (category && CATEGORIES.includes(category)) {
      query.category = category;
    }
    if (language) query.language = language;
    if (license) query.license = license;
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {
      stars: { stars: -1 },
      plays: { plays: -1 },
      updated: { lastUpdated: -1 },
      newest: { createdAt: -1 },
      name: { title: 1 },
      views: { views: -1 }
    };
    const sortBy = sortOptions[sort] || sortOptions.stars;

    const [games, total] = await Promise.all([
      Game.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .select('-customDescription -__v')
        .lean(),
      Game.countDocuments(query)
    ]);

    const result = {
      games,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    };

    await setCache(cacheKey, result, 3600); // 1 hour
    res.json(result);
  } catch (error) {
    console.error('getGames error:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

// GET /api/games/featured
const getFeaturedGames = async (req, res) => {
  try {
    const cached = await getCache('games:featured');
    if (cached) return res.json(cached);

    const games = await Game.find({ active: true, featured: true })
      .sort({ stars: -1 })
      .limit(30)
      .select('-customDescription -__v')
      .lean();

    await setCache('games:featured', games, 3600);
    res.json(games);
  } catch (error) {
    console.error('getFeaturedGames error:', error);
    res.status(500).json({ error: 'Failed to fetch featured games' });
  }
};

// GET /api/games/:slug
const getGameBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const cacheKey = `game:${slug}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const game = await Game.findOne({ slug, active: true }).lean();
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Get related games
    const related = await Game.find({
      category: game.category,
      active: true,
      _id: { $ne: game._id }
    })
      .sort({ stars: -1 })
      .limit(6)
      .select('name slug title thumbnail category stars plays license verified')
      .lean();

    const result = { ...game, related };
    await setCache(cacheKey, result, 86400); // 24 hours
    res.json(result);
  } catch (error) {
    console.error('getGameBySlug error:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
};

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const cached = await getCache('categories');
    if (cached) return res.json(cached);

    const categoryCounts = await Game.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const result = categoryCounts.map(c => ({
      name: c._id,
      slug: c._id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      count: c.count
    }));

    await setCache('categories', result, 3600);
    res.json(result);
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// GET /api/search
const searchGames = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 24 } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query = {
      active: true,
      $text: { $search: q.trim() }
    };
    if (category && CATEGORIES.includes(category)) {
      query.category = category;
    }

    const [games, total] = await Promise.all([
      Game.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limitNum)
        .select('-customDescription -__v')
        .lean(),
      Game.countDocuments(query)
    ]);

    res.json({
      games,
      query: q,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('searchGames error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

// POST /api/games/:id/play
const trackPlay = async (req, res) => {
  try {
    const { id } = req.params;
    const ip = req.ip || req.connection.remoteAddress;
    
    await Promise.all([
      Game.findByIdAndUpdate(id, { $inc: { plays: 1 } }),
      Analytics.create({
        gameId: id,
        event: 'play',
        ip: Analytics.hashIP(ip),
        userAgent: req.headers['user-agent'] || ''
      })
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('trackPlay error:', error);
    res.status(500).json({ error: 'Failed to track play' });
  }
};

// POST /api/games/:id/view
const trackView = async (req, res) => {
  try {
    const { id } = req.params;
    const ip = req.ip || req.connection.remoteAddress;
    
    await Promise.all([
      Game.findByIdAndUpdate(id, { $inc: { views: 1 } }),
      Analytics.create({
        gameId: id,
        event: 'view',
        ip: Analytics.hashIP(ip),
        userAgent: req.headers['user-agent'] || ''
      })
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('trackView error:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
};

// GET /api/games/trending
const getTrendingGames = async (req, res) => {
  try {
    const cached = await getCache('games:trending');
    if (cached) return res.json(cached);

    const games = await Game.find({ active: true })
      .sort({ lastUpdated: -1, stars: -1 })
      .limit(12)
      .select('-customDescription -__v')
      .lean();

    await setCache('games:trending', games, 3600);
    res.json(games);
  } catch (error) {
    console.error('getTrendingGames error:', error);
    res.status(500).json({ error: 'Failed to fetch trending games' });
  }
};

// GET /api/games/popular
const getPopularGames = async (req, res) => {
  try {
    const cached = await getCache('games:popular');
    if (cached) return res.json(cached);

    const games = await Game.find({ active: true })
      .sort({ plays: -1, views: -1 })
      .limit(12)
      .select('-customDescription -__v')
      .lean();

    await setCache('games:popular', games, 3600);
    res.json(games);
  } catch (error) {
    console.error('getPopularGames error:', error);
    res.status(500).json({ error: 'Failed to fetch popular games' });
  }
};

// GET /api/stats
const getPublicStats = async (req, res) => {
  try {
    const cached = await getCache('stats:public');
    if (cached) return res.json(cached);

    const [totalGames, totalCategories] = await Promise.all([
      Game.countDocuments({ active: true }),
      Game.distinct('category', { active: true })
    ]);

    const result = {
      totalGames,
      totalCategories: totalCategories.length,
    };

    await setCache('stats:public', result, 3600);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

module.exports = {
  getGames,
  getFeaturedGames,
  getGameBySlug,
  getCategories,
  searchGames,
  trackPlay,
  trackView,
  getTrendingGames,
  getPopularGames,
  getPublicStats,
  CATEGORIES
};
