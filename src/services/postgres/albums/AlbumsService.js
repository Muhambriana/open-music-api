import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import InvariantError from '../../../exceptions/InvariantError.js';
import { mapAlbumWithSongDBToModel } from '../../../utils/index.js';
import NotFoundError from '../../../exceptions/NotFoundError.js';
import ResponseTypeEnum from '../../../config/ResponseTypeEnum.js';

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
      throw new InvariantError(ResponseTypeEnum.ALBUM_FAILED_TO_CREATE.defaultMessage);
    }

    return resultAlbumId;
  }

  async getAlbumById(albumId) {
    const queryAlbums = {
      text: 'SELECT * FROM albums WHERE album_id = $1',
      values: [albumId],
    };

    const querySongs = {
      text: 'SELECT song_id as id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const resultAlbums = await this._pool.query(queryAlbums);
    const resultSongs = await this._pool.query(querySongs);

    const albums = resultAlbums.rows;
    const songs = resultSongs.rows;

    if (!albums.length) {
      throw new NotFoundError(ResponseTypeEnum.ALBUM_NOT_EXIST.defaultMessage);
    }

    return mapAlbumWithSongDBToModel({
      ...albums[0],
      songs,
    });
  }

  async editAlbumById(albumId, { name, year }) {
    const updateAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE album_id = $4 RETURNING album_id',
      values: [name, year, updateAt, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(ResponseTypeEnum.ALBUM_NOT_EXIST.defaultMessage);
    }
  }

  async deleteAlbumById(albumId) {
    const query = {
      text: 'DELETE FROM albums WHERE album_id = $1 RETURNING album_id',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(ResponseTypeEnum.ALBUM_NOT_EXIST.defaultMessage);
    }
  }
}

export default AlbumsService;
