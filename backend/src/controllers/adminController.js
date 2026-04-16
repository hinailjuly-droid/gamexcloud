const Game = require('../models/Game');
const Admin = require('../models/Admin');
const Analytics = require('../models/Analytics');
const { generateTokens } = require('../middleware/auth');
const { fetchGamesFromGitHub } = require('../services/githubFetch');
const { clearAllCache } = require('../services/cache');

// POST /api/admin/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { token, refreshToken } = generateTokens(admin._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      admin: admin.toJSON(),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// POST /api/admin/logout
const logout = async (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ success: true });
};

// GET /api/admin/me
const getMe = async (req, res) => {
  res.json(req.admin.toJSON());
};

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [
      totalGames,
      activeGames,
      featuredGames,
      verifiedGames,
      monthlyPlays,
      monthlyViews,
      topGames,
      recentGames,
      categoryBreakdown
    ] = await Promise.all([
      Game.countDocuments(),
      Game.countDocuments({ active: true }),
      Game.countDocuments({ featured: true }),
      Game.countDocuments({ verified: true }),
      Analytics.countDocuments({ event: 'play', timestamp: { $gte: thirtyDaysAgo } }),
      Analytics.countDocuments({ event: 'view', timestamp: { $gte: thirtyDaysAgo } }),
      Game.find({ active: true }).sort({ plays: -1 }).limit(10).select('name slug title plays views category').lean(),
      Game.find().sort({ fetchedAt: -1 }).limit(10).select('name slug title category fetchedAt stars').lean(),
      Game.aggregate([
        { $match: { active: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      stats: {
        totalGames,
        activeGames,
        featuredGames,
        verifiedGames,
        monthlyPlays,
        monthlyViews
      },
      topGames,
      recentGames,
      categoryBreakdown
    });
  } catch (error) {
    console.error('getDashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

// GET /api/admin/games
const getAdminGames = async (req, res) => {
  try {
    const { page = 1, limit = 50, category, search, status, sort = 'stars' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (category) query.category = category;
    if (status === 'active') query.active = true;
    if (status === 'inactive') query.active = false;
    if (status === 'featured') query.featured = true;
    if (status === 'verified') query.verified = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {
      stars: { stars: -1 },
      plays: { plays: -1 },
      views: { views: -1 },
      updated: { lastUpdated: -1 },
      newest: { createdAt: -1 },
      name: { title: 1 }
    };

    const [games, total] = await Promise.all([
      Game.find(query)
        .sort(sortOptions[sort] || sortOptions.stars)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Game.countDocuments(query)
    ]);

    res.json({
      games,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('getAdminGames error:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

// PUT /api/admin/games/:id
const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    const allowed = ['customDescription', 'playUrl', 'thumbnail', 'category', 'featured', 'verified', 'active', 'title', 'hasLiveUrl'];
    
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const game = await Game.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    await clearAllCache();
    res.json(game);
  } catch (error) {
    console.error('updateGame error:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
};

// DELETE /api/admin/games/:id (soft delete)
const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    await clearAllCache();
    res.json({ success: true, game });
  } catch (error) {
    console.error('deleteGame error:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

// POST /api/admin/games/:id/feature
const toggleFeature = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    game.featured = !game.featured;
    await game.save();
    await clearAllCache();
    res.json({ success: true, featured: game.featured });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle feature' });
  }
};

// POST /api/admin/games/:id/verify
const toggleVerify = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    game.verified = !game.verified;
    await game.save();
    await clearAllCache();
    res.json({ success: true, verified: game.verified });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle verify' });
  }
};

// POST /api/admin/fetch
const triggerFetch = async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(400).json({ error: 'GitHub token not configured' });
    }

    res.json({ message: 'Fetch started. This may take a few minutes.' });

    // Run in background
    (async () => {
      try {
        const games = await fetchGamesFromGitHub(token);
        let created = 0, updated = 0;

        for (const gameData of games) {
          const existing = await Game.findOne({ githubId: gameData.githubId });
          if (existing) {
            // Update existing - preserve admin edits
            await Game.updateOne(
              { githubId: gameData.githubId },
              {
                $set: {
                  stars: gameData.stars,
                  forks: gameData.forks,
                  lastUpdated: gameData.lastUpdated,
                  tags: gameData.tags,
                  fetchedAt: new Date()
                }
              }
            );
            updated++;
          } else {
            await Game.create(gameData);
            created++;
          }
        }

        console.log(`✅ Fetch complete: ${created} created, ${updated} updated`);
        await clearAllCache();
      } catch (err) {
        console.error('Background fetch error:', err);
      }
    })();
  } catch (error) {
    console.error('triggerFetch error:', error);
    res.status(500).json({ error: 'Failed to trigger fetch' });
  }
};

// POST /api/admin/games/bulk
const bulkAction = async (req, res) => {
  try {
    const { ids, action } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No game IDs provided' });
    }

    const updates = {};
    switch (action) {
      case 'feature': updates.featured = true; break;
      case 'unfeature': updates.featured = false; break;
      case 'verify': updates.verified = true; break;
      case 'unverify': updates.verified = false; break;
      case 'activate': updates.active = true; break;
      case 'deactivate': updates.active = false; break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    const result = await Game.updateMany({ _id: { $in: ids } }, { $set: updates });
    await clearAllCache();
    
    res.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: 'Bulk action failed' });
  }
};

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [dailyStats, topByPlays, categoryStats] = await Promise.all([
      Analytics.aggregate([
        { $match: { timestamp: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
              event: '$event'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.date': 1 } }
      ]),
      Game.find({ active: true }).sort({ plays: -1 }).limit(20).select('name slug title plays views category').lean(),
      Game.aggregate([
        { $match: { active: true } },
        { $group: { _id: '$category', count: { $sum: 1 }, totalPlays: { $sum: '$plays' }, totalViews: { $sum: '$views' } } },
        { $sort: { count: -1 } }
      ])
    ]);

    // Format daily stats into a more usable format
    const dailyMap = {};
    dailyStats.forEach(stat => {
      if (!dailyMap[stat._id.date]) {
        dailyMap[stat._id.date] = { date: stat._id.date, views: 0, plays: 0 };
      }
      dailyMap[stat._id.date][stat._id.event + 's'] = stat.count;
    });

    res.json({
      daily: Object.values(dailyMap),
      topByPlays,
      categoryStats
    });
  } catch (error) {
    console.error('getAnalytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// PUT /api/admin/settings/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const admin = await Admin.findById(req.admin._id);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    admin.passwordHash = newPassword;
    await admin.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
};

module.exports = {
  login,
  logout,
  getMe,
  getDashboard,
  getAdminGames,
  updateGame,
  deleteGame,
  toggleFeature,
  toggleVerify,
  triggerFetch,
  bulkAction,
  getAnalytics,
  changePassword
};
