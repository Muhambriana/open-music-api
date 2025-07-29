import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';
import ExceptionTypeEnum from '../../config/ExceptionTypeEnum.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const playlistId = nanoid(10);

    const query = {
      text: 'INSERT INTO playlists(public_id, name, owner) VALUES ($1, $2, $3) RETURNING public_id',
      values: [playlistId, name, owner],
    };

    const result = await this._pool.query(query);

    const resultPlaylistId = result.rows[0].public_id;

    if (!resultPlaylistId) {
      throw new InvariantError(ExceptionTypeEnum.PLAYLIST_FAILED_TO_CREATE.defaultMessage);
    }

    return resultPlaylistId;
  }

  async getPlaylistsByUserId(userId) {
    const query = {
      text: `SELECT p.public_id as id, p.name, u.username
      FROM playlists p
      JOIN users u ON u.rec_id = p.owner
      WHERE owner = $1
      `,
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE public_id = $1 RETURNING public_id',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.PLAYLIST_NOT_EXIST.defaultMessage);
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE public_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.PLAYLIST_NOT_EXIST.defaultMessage);
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError(ExceptionTypeEnum.NOT_AUTHORIZED.defaultMessage);
    }
  }

  async addSongIntoPlaylist(playlistId, songId) {
    const query = {
      text: 'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2) RETURNING rec_id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(ExceptionTypeEnum.FAILED_ADD_SONG_INTO_PLAYLIST.defaultMessage);
    }

    return result.rows.rec_id;
  }

  async getPlaylistRecordId(playlistId) {
    const query = {
      text: 'SELECT rec_id as recId FROM playlists WHERE public_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.PLAYLIST_NOT_EXIST.defaultMessage);
    }

    return result.rows[0].recId;
  }
}

export default PlaylistsService;
