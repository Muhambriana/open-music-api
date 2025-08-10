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
    const cached = await this.get(key).catch(() => null);

    if (cached != null) {
      return {
        source: 'cache',
        data: JSON.parse(cached),
      };
    }

    const data = await fetchFunction();
    await this.set(key, JSON.stringify(data), expirationInSecond);
    return {
      source: 'db',
      data,
    };
  }
}

export default CacheService;
