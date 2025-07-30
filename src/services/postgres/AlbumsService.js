import { Pool } from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';
import { mapAlbumWithSongDBToModel } from '../../utils/index.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import ExceptionTypeEnum from '../../config/ExceptionTypeEnum.js';
import { generateNanoid } from '../../utils/helper.js';

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  setSongsService(songsService) {
    this._songsService = songsService;
  }

  async addAlbum({ name, year }) {
    const albumId = generateNanoid('album');
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums (public_id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING public_id',
      values: [albumId, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    const resultAlbumId = result.rows[0].public_id;

    if (!resultAlbumId) {
      throw new InvariantError(ExceptionTypeEnum.ALBUM_FAILED_TO_CREATE.defaultMessage);
    }

    return resultAlbumId;
  }

  async getAlbumById(albumId) {
    const queryAlbums = {
      text: 'SELECT * FROM albums WHERE public_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(queryAlbums);

    if (!result.rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.ALBUM_NOT_EXIST.defaultMessage);
    }

    return result.rows[0];
  }

  async getAlbumAndSongsByAlbumId(albumId) {
    const album = await this.getAlbumById(albumId);
    const songs = await this._songsService.getSongsByAlbumId(album.rec_id);

    return mapAlbumWithSongDBToModel({
      ...album,
      songs,
    });
  }

  async editAlbumById(albumId, { name, year }) {
    const updateAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE public_id = $4 RETURNING public_id',
      values: [name, year, updateAt, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(ExceptionTypeEnum.ALBUM_NOT_EXIST.defaultMessage);
    }
  }

  async deleteAlbumById(albumId) {
    const query = {
      text: 'DELETE FROM albums WHERE public_id = $1 RETURNING public_id',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(ExceptionTypeEnum.ALBUM_NOT_EXIST.defaultMessage);
    }
  }
}

export default AlbumsService;
