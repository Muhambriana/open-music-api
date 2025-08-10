import redis from 'redis';
import config from '../../utils/config/config.js';

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on('error', (error) => {
      console.log(error);
    });

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error('Cache is not exist');

    return result;
  }

  async delete(key) {
    return this._client.del(key);
  }

  async getOrSet(key, fetchFunction, expirationInSecond = 1800) {
    try {
      const cached = await this.get(key);
      return {
        source: 'cache',
        data: JSON.parse(cached),
      };
    } catch {
      const data = await fetchFunction();

      await this.set(key, JSON.stringify(data), expirationInSecond);

      return {
        source: 'database',
        data,
      };
    }
  }
}

export default CacheService;
