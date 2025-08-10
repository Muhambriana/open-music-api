import { Pool } from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import ExceptionTypeEnum from '../../utils/config/ExceptionTypeEnum.js';
import { generateNanoid } from '../../utils/helper.js';
import { mapAlbumDBToModel } from '../../utils/index.js';
import ClientError from '../../exceptions/ClientError.js';

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
      text: 'SELECT public_id, name, year, cover FROM albums WHERE public_id = $1',
      values: [albumId],
    };

    const { rows } = await this._pool.query(queryAlbums);

    if (!rows.length) {
      throw new NotFoundError(ExceptionTypeEnum.ALBUM_NOT_EXIST.defaultMessage);
    }

    return rows.map(mapAlbumDBToModel)[0];
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

  async updateAlbumCoverById(albumId, cover) {
    try {
      const query = {
        text: 'UPDATE albums SET cover = $1 WHERE public_id = $2 RETURNING public_id',
        values: [cover, albumId],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new InvariantError(ExceptionTypeEnum.FAILED_UPDATE_ALBUM_COVER.defaultMessage);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addAlbumLike(userRecId, albumRecId) {
    await this.isLikeAlbumExist(userRecId, albumRecId);

    const query = {
      text: 'INSERT INTO user_album_likes (user_id, album_id) VALUES ($1, $2) RETURNING rec_id',
      values: [userRecId, albumRecId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(ExceptionTypeEnum.FAILED_ADD_ALBUM_LIKE.defaultMessage);
    }
  }

  async isLikeAlbumExist(userRecId, albumRecId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userRecId, albumRecId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new ClientError(ExceptionTypeEnum.USER_ALREADY_LIKED_ALBUM.defaultMessage);
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: `DELETE
      FROM user_album_likes ual
      USING users u, albums a
      WHERE u.rec_id = ual.user_id
        AND a.rec_id = ual.album_id
        AND u.public_id = $1 
        AND a.public_id = $2  
      RETURNING ual.rec_id
      `,
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(ExceptionTypeEnum.FAILED_DELETE_ALBUM_LIKE.defaultMessage);
    }
  }

  async getTotalAlbumLikes(albumId) {
    const query = {
      text: `SELECT COUNT(ual.*)::int as total
      FROM user_album_likes ual
      JOIN albums a ON a.rec_id = ual.album_id
      WHERE a.public_id = $1
      `,
      values: [albumId],
    };

    const { rows } = await this._pool.query(query);

    return rows[0].total;
  }
}

export default AlbumsService;
