import os
import redis

# Get the Redis URL from the environment (with fallback for local testing)
redis_url = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0")

# Remove ssl_cert_reqs since it's not accepted by this version of redis-py.
r = redis.from_url(redis_url)

try:
    response = r.ping()
    if response:
        print("Redis is working properly (PING response: PONG)!")
    else:
        print("No response from Redis!")
except Exception as e:
    print("Error connecting to Redis:", e) 