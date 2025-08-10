import { Pool } from 'pg';
import { generateNanoid, isBlankString } from '../../utils/helper.js';
import InvariantError from '../../exceptions/InvariantError.js';
import { mapSongDBToModel } from '../../utils/index.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import ExceptionTypeEnum from '../../utils/config/ExceptionTypeEnum.js';
import CacheKeyEnum from '../../utils/config/CacheKeyEnum.js';

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  setCacheService(cacheService) {
    this._cacheService = cacheService;
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

    const query = {
      text: 'INSERT INTO songs (public_id, title, year, genre, performer, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING public_id',
      values: [
        songId,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      ],
    };

    const result = await this._pool.query(query);

    const resultSongId = result.rows[0].public_id;

    if (!resultSongId) {
      throw new InvariantError(ExceptionTypeEnum.SONG_FAILED_TO_CREATE.defaultMessage);
    }

    await this._cacheService.delete(CacheKeyEnum.SONGS.key);

    return resultSongId;
  }

  async getSongs(title = '', performer = '') {
    const isShouldUseCache = title.isBlankString && performer.isBlankString;
    const fetchFromDb = async () => {
      const query = {
        text: 'SELECT public_id as id, title, performer FROM songs WHERE title ILIKE $1 and performer ILIKE $2',
        values: [`%${title}%`, `%${performer}%`],
      };
      const { rows } = await this._pool.query(query);
      return rows;
    };

    if (isShouldUseCache) {
      const cacheKey = CacheKeyEnum.SONGS.key;
      const result = this._cacheService.getOrSet(cacheKey, fetchFromDb);
      return result;
    }

    const result = await fetchFromDb();

    return {
      source: 'db',
      data: result,
    };
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
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE public_id = $7 RETURNING public_id',
      values: [
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        songId,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(ExceptionTypeEnum.SONG_NOT_EXIST.defaultMessage);
    }

    await this._cacheService.delete(CacheKeyEnum.SONGS.key);
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

    await this._cacheService.delete(CacheKeyEnum.SONGS.key);
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
