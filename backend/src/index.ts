import app from './app';
import { connectRedis } from './redis/redisClient';

connectRedis();

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})