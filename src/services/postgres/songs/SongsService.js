import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import InvariantError from '../../../exceptions/InvariantError.js';
import { mapSongDBToModel } from '../../../utils/index.js';
import NotFoundError from '../../../exceptions/NotFoundError.js';
import getDateTimeNow from '../../../utils/helper.js';
import ResponseTypeEnum from '../../../config/ResponseTypeEnum.js';

class SongsService {
  constructor(albumsService) {
    this._pool = new Pool();
    this._albumsService = albumsService;
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    let album = null;

    if (albumId) {
      album = await this._albumsService.getAlbumById(albumId);
    }

    const songId = nanoid();
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
        album ? album.rec_id : null,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    const resultSongId = result.rows[0].public_id;

    if (!resultSongId) {
      throw new InvariantError(ResponseTypeEnum.SONG_FAILED_TO_CREATE.defaultMessage);
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
      throw new NotFoundError(ResponseTypeEnum.SONG_NOT_EXIST.defaultMessage);
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
    let album = null;

    if (albumId) {
      album = await this._albumsService.getAlbumById(albumId);
    }

    const updatedAt = getDateTimeNow();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE public_id = $8 RETURNING public_id',
      values: [
        title,
        year,
        genre,
        performer,
        duration,
        album ? album.rec_id : null,
        updatedAt,
        songId,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(ResponseTypeEnum.SONG_NOT_EXIST.defaultMessage);
    }
  }

  async deleteSongById(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE public_id = $1 RETURNING public_id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(ResponseTypeEnum.SONG_NOT_EXIST.defaultMessage);
    }
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT public_id as id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

export default SongsService;
