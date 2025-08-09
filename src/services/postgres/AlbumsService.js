import { Pool } from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import ExceptionTypeEnum from '../../utils/config/ExceptionTypeEnum.js';
import { generateNanoid } from '../../utils/helper.js';

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const albumId = generateNanoid('album');

    const query = {
      text: 'INSERT INTO albums (public_id, name, year) VALUES($1, $2, $3) RETURNING public_id',
      values: [albumId, name, year],
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
      text: 'SELECT public_id as id, name, year FROM albums WHERE public_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(queryAlbums);

    if (!result.rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.ALBUM_NOT_EXIST.defaultMessage);
    }

    return result.rows[0];
  }

  async editAlbumById(albumId, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE public_id = $3 RETURNING public_id',
      values: [name, year, albumId],
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

  async getAlbumRecordId(albumId) {
    const queryAlbums = {
      text: 'SELECT rec_id as recid FROM albums WHERE public_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(queryAlbums);

    if (!result.rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.ALBUM_NOT_EXIST.defaultMessage);
    }

    return result.rows[0].recid;
  }
}

export default AlbumsService;
