const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const { loginLimiter, adminLimiter } = require('../middleware/rateLimit');
const {
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
} = require('../controllers/adminController');

// Public admin routes
router.post('/login', loginLimiter, login);

// Protected admin routes
router.use(auth);
router.use(adminLimiter);

router.post('/logout', logout);
router.get('/me', getMe);
router.get('/dashboard', getDashboard);
router.get('/games', getAdminGames);
router.put('/games/:id', updateGame);
router.delete('/games/:id', deleteGame);
router.post('/games/:id/feature', toggleFeature);
router.post('/games/:id/verify', toggleVerify);
router.post('/games/bulk', bulkAction);
router.post('/fetch', triggerFetch);
router.get('/analytics', getAnalytics);
router.put('/settings/password', changePassword);

module.exports = router;
