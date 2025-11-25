const {createClient} = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Redis client connected');
    }
}
module.exports = {
    redisClient,
    connectRedis
};