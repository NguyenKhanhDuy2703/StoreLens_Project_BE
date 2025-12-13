const {createClient} = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL_LOCAL
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Redis client connected');
    }else{
        console.log('Redis client already connected');
    }
}
module.exports = {
    redisClient,
    connectRedis
};