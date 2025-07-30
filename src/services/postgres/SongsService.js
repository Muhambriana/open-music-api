import { Pool } from 'pg';
import { getDateTimeNow, generateNanoid } from '../../utils/helper.js';
import InvariantError from '../../exceptions/InvariantError.js';
import { mapSongDBToModel } from '../../utils/index.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import ExceptionTypeEnum from '../../config/ExceptionTypeEnum.js';

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
    const songId = generateNanoid('song');
    const createdAt = getDateTimeNow();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs (public_id, title, year, genre, performer, duration, album_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING public_id',
      values: [
        songId,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    const resultSongId = result.rows[0].public_id;

    if (!resultSongId) {
      throw new InvariantError(ExceptionTypeEnum.SONG_FAILED_TO_CREATE.defaultMessage);
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
      text: `SELECT public_id as id, title, performer FROM songs ${whereClause}`,
      values,
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE public_id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);
    const songs = result.rows;

    if (!songs.length) {
      throw new NotFoundError(ExceptionTypeEnum.SONG_NOT_EXIST.defaultMessage);
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
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE public_id = $8 RETURNING public_id',
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
      throw new NotFoundError(ExceptionTypeEnum.SONG_NOT_EXIST.defaultMessage);
    }
  }

  async deleteSongById(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE public_id = $1 RETURNING public_id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(ExceptionTypeEnum.SONG_NOT_EXIST.defaultMessage);
    }
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: `SELECT s.public_id as id, s.title, s.performer 
      FROM songs s
      JOIN albums a ON a.rec_id = s.album_id 
      WHERE a.public_id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getSongRecordId(songId) {
    const query = {
      text: 'SELECT rec_id as recid FROM songs WHERE public_id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.SONG_NOT_EXIST.defaultMessage);
    }

    return result.rows[0].recid;
  }
}

export default SongsService;
