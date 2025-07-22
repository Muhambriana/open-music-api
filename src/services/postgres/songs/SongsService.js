import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import InvariantError from '../../../exceptions/InvariantError.js';
import { mapSongDBToModel } from '../../../utils/index.js';
import NotFoundError from '../../../exceptions/NotFoundError.js';
import getDateTimeNow from '../../../utils/helper.js';

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
    const createdAt = getDateTimeNow();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs (song_id, title, year, genre, performer, duration, album_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING song_id',
      values: [songId, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    const resultSongId = result.rows[0].song_id;

    if (!resultSongId) {
      throw new InvariantError('Song failed to create');
    }

    return resultSongId;
  }

  async getSongs(title, performer) {
    const values = [];
    const conditions = [];

    if (title) {
      values.push(`%${title}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    if (performer) {
      values.push(`%${performer}%`);
      conditions.push(`performer ILIKE $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = {
      text: `SELECT song_id as id, title, performer FROM songs ${whereClause}`,
      values,
    };

    const finalQuery = query.text.replace(/\$\d+/g, (match) => {
      // eslint-disable-next-line radix
      const index = parseInt(match.slice(1)) - 1;
      const value = values[index];
      return typeof value === 'string' ? `'${value}'` : value;
    });
    console.log('Executing query:', finalQuery);

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE song_id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);
    const songs = result.rows;

    if (!songs.length) {
      throw new NotFoundError('Song not found');
    }

    return songs.map(mapSongDBToModel)[0];
  }

  async editSongById(songId, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const updatedAt = getDateTimeNow();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE song_id = $8 RETURNING song_id',
      values: [
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        updatedAt,
        songId,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
  }

  async deleteSongById(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE song_id = $1 RETURNING song_id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
  }
}

export default SongsService;
