-- run redis  by docker ---
docker run -d --name q storelens -p 6379:6379 redis:latest
-- verify redis is running ---
docker ps
-- update correct address IP at file redis.js --
exmaple:
REDIS_URL=redis://redis:6379 -> run BE , redis service name on docker network
REDIS_URL_LOCAL=redis://127.0.0.1:6379 -> run BE on local machine , connect to  redis on docker 
