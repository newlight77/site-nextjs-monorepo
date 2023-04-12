import { Redis } from 'ioredis';

const host = process.env.REDIS_HOST || '';
export const port = process.env.REDIS_PORT || '6379';
export const username = process.env.REDIS_USERNAME || '';
export const password = process.env.REDIS_PASSWORD || '';

export const redisClient = new Redis({
    host: host,
    port: Number(port),
    username:username,
    password: password
});

// export const redisClient:any = createClient({
//     url: `redis://${username}:${password}@${host}:${port}`
// });