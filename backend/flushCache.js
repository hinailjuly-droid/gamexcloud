require('dotenv').config();
const { connectRedis, clearAllCache } = require('./src/services/cache');

async function flush() {
  try {
    const client = await connectRedis();
    if (client) {
      console.log('Flushing all cache...');
      await clearAllCache();
      console.log('✅ Cache flushed');
    } else {
      console.log('❌ Could not connect to Redis');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

flush();
