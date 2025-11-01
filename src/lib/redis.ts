import Redis from "ioredis";
import { config } from "@/lib/config";

let redisClient: Redis | null = null;

/**
 * Get or create a Redis client instance
 */
export function getRedisClient(): Redis | null {
  // Return null if Redis is not configured
  if (!config.redis.url) {
    return null;
  }

  // Return existing client if available
  if (redisClient) {
    return redisClient;
  }

  // Create new client if Redis URL is configured
  try {
    redisClient = new Redis(config.redis.url, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redisClient.on("error", (error) => {
      console.error("Redis Client Error:", error);
    });

    redisClient.on("connect", () => {
      console.log("Redis Client Connected");
    });

    return redisClient;
  } catch (error) {
    console.error("Failed to create Redis client:", error);
    return null;
  }
}

/**
 * Gracefully close Redis connection
 */
export async function closeRedisClient(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

