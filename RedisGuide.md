-- run redis  by docker ---
docker run -d --name storelens -p 6379:6379 redis:latest
-- verify redis is running ---
docker ps
