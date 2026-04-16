const express = require('express');
const router = express.Router();
const {
  getGames,
  getFeaturedGames,
  getGameBySlug,
  getCategories,
  searchGames,
  trackPlay,
  trackView,
  getTrendingGames,
  getPopularGames,
  getPublicStats
} = require('../controllers/gameController');

// Order matters - specific routes before parameterized routes
router.get('/featured', getFeaturedGames);
router.get('/trending', getTrendingGames);
router.get('/popular', getPopularGames);
router.get('/stats', getPublicStats);
router.get('/categories', getCategories);
router.get('/search', searchGames);
router.get('/', getGames);
router.get('/:slug', getGameBySlug);
router.post('/:id/play', trackPlay);
router.post('/:id/view', trackView);

module.exports = router;
