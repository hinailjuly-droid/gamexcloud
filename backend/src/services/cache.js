const { createClient } = require('redis');

let redisClient = null;
let isConnected = false;

const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      console.log('⚠️  No REDIS_URL set, running without cache');
      return null;
    }
    
    redisClient = createClient({ 
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('⚠️  Redis reconnection failed after 3 attempts. Standing down.');
            return false; // stop retrying
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });
    
    redisClient.on('error', (err) => {
      // Only log full error if NOT a connection failure to avoid spam
      if (!err.message.includes('ECONNREFUSED')) {
        console.error('Redis error:', err.message);
      }
      isConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
      isConnected = true;
    });

    redisClient.on('end', () => {
      isConnected = false;
    });

    // Use a race to prevent hanging on .connect() indefinitely
    await Promise.race([
      redisClient.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connection timeout')), 5000))
    ]);

    return redisClient;
  } catch (error) {
    console.error('Redis connection failed:', error.message);
    console.log('⚠️  Running without cache');
    isConnected = false;
    return null;
  }
};

const getCache = async (key) => {
  if (!isConnected || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error.message);
    return null;
  }
};

const setCache = async (key, data, ttlSeconds = 3600) => {
  if (!isConnected || !redisClient) return;
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    console.error('Redis set error:', error.message);
  }
};

const deleteCache = async (pattern) => {
  if (!isConnected || !redisClient) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Redis delete error:', error.message);
  }
};

const clearAllCache = async () => {
  if (!isConnected || !redisClient) return;
  try {
    await redisClient.flushDb();
  } catch (error) {
    console.error('Redis flush error:', error.message);
  }
};

module.exports = { connectRedis, getCache, setCache, deleteCache, clearAllCache };
