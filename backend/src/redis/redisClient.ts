import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://redis:6379'
  });
  
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });
  
const connectRedis = async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
  };
  
export { redisClient, connectRedis };