import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import InvariantError from '../../../exceptions/InvariantError.js';

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const songId = nanoid();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs (song_id, title, year, genre, performer, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING song_id',
      values: [songId, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    const resultSongId = result.rows[0].song_id;

    if (!resultSongId) {
      throw new InvariantError('Song failed to create');
    }

    return resultSongId;
  }
}

export default SongsService;
