import { Redis } from 'ioredis';

const host = process.env.REDIS_HOST || '';
export const port = process.env.REDIS_PORT || '6379';
export const username = process.env.REDIS_USERNAME || '';
export const password = process.env.REDIS_PASSWORD || '';

type RedisLike = Pick<Redis, 'get' | 'ttl' | 'set'>;

const noOpRedisClient: RedisLike = {
  async get(): Promise<string | null> { return null; },
  async ttl(): Promise<number> { return -1; },
  async set(): Promise<'OK'> { return 'OK'; },
};

let redisSingleton: Redis | null = null;

const createRedisClient = (): RedisLike => {
  if (process.env.REDIS_ENABLE !== 'true' || !host) {
    return noOpRedisClient;
  }

  if (!redisSingleton) {
    redisSingleton = new Redis({
      host,
      port: Number(port),
      username,
      password,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
  }

  return redisSingleton as RedisLike;
};

export const redisClient: RedisLike = {
  async get(key: string): Promise<string | null> {
    return createRedisClient().get(key);
  },
  async ttl(key: string): Promise<number> {
    return createRedisClient().ttl(key);
  },
  async set(key: string, value: string): Promise<'OK'> {
    return createRedisClient().set(key, value, 'EX', 24 * 60 * 60, 'GET') as Promise<'OK'>;
  },
};