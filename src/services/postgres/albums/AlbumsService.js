import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import InvariantError from '../../../exceptions/InvariantError.js';
import { mapAlbumDBToModel } from '../../../utils/index.js';
import NotFoundError from '../../../exceptions/NotFoundError.js';

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const albumId = nanoid();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums (album_id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING album_id',
      values: [albumId, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    const resultAlbumId = result.rows[0].album_id;

    if (!resultAlbumId) {
      throw new InvariantError('Album failed to create');
    }

    return resultAlbumId;
  }

  async getAlbumById(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    const albums = result.rows;

    if (!albums.length) {
      throw new NotFoundError('Album not found');
    }

    return albums.map(mapAlbumDBToModel)[0];
  }
}

export default AlbumsService;
