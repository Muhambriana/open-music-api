import { Pool } from 'pg';
import { generateNanoid, getDateTimeNow } from '../../utils/helper.js';
import InvariantError from '../../exceptions/InvariantError.js';
import ExceptionTypeEnum from '../../utils/config/ExceptionTypeEnum.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';
import CacheKeyEnum from '../../utils/config/CacheKeyEnum.js';

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  setCollaborationsService(collaborationsService) {
    this._collaborationsService = collaborationsService;
  }

  setUsersService(usersService) {
    this._usersService = usersService;
  }

  setCacheService(cacheService) {
    this._cacheService = cacheService;
  }

  async addPlaylist({ name, owner }) {
    const playlistId = generateNanoid('playlist');

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
      text: `
      SELECT p.public_id as id, p.name, u.username
      FROM playlists p
      JOIN users u ON u.rec_id = p.owner
      LEFT JOIN collaborations c ON c.playlist_id = p.rec_id
      WHERE u.public_id = $1
      OR c.user_id = (SELECT rec_id FROM users WHERE public_id = $1)
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

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE public_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.PLAYLIST_NOT_EXIST.defaultMessage);
    }

    const playlist = result.rows[0];
    const userRecordId = await this._usersService.getUserRecordId(userId);

    if (playlist.owner !== userRecordId) {
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

    await this._cacheService.delete(CacheKeyEnum.PLAYLIST_SONGS.getFinalKey(playlistId));
    return result.rows.rec_id;
  }

  async getPlaylistRecordId(playlistId) {
    const query = {
      text: 'SELECT rec_id as recid FROM playlists WHERE public_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.PLAYLIST_NOT_EXIST.defaultMessage);
    }

    return result.rows[0].recid;
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT p.public_id as id, p.name, u.username
      FROM playlists p
      JOIN users u ON u.rec_id = p.owner
      WHERE p.public_id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.PLAYLIST_NOT_EXIST.defaultMessage);
    }

    return result.rows[0];
  }

  async getPlaylistSongs(playlistId) {
    const cacheKey = CacheKeyEnum.PLAYLIST_SONGS.getFinalKey(playlistId);

    const fetchFromDb = async () => {
      const query = {
        text: `SELECT s.public_id as id, s.title, s.performer
        FROM songs s
        JOIN playlist_songs ps ON ps.song_id = s.rec_id
        JOIN playlists p ON p.rec_id = ps.playlist_id
        WHERE p.public_id = $1
        `,
        values: [playlistId],
      };

      const { rows } = await this._pool.query(query);

      return rows;
    }

    const result = await this._cacheService.getOrSet(cacheKey, fetchFromDb);
    return result;
  }

  async deletePlaylistSongById(playlistId, songId) {
    const query = {
      text: `DELETE
      FROM playlist_songs ps
      USING playlists p,songs s
      WHERE p.rec_id = ps.playlist_id
        AND s.rec_id = ps.song_id
        AND p.public_id = $1 
        AND s.public_id = $2  
      RETURNING ps.playlist_id AS playlist_rec_id, ps.song_id AS song_rec_id
      `,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song Or Playlis is not exist');
    }

    await this._cacheService.delete(CacheKeyEnum.PLAYLIST_SONGS.getFinalKey(playlistId));
    return result.rows[0];
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async addActivity(
    playlistRecId, 
    songRecId, 
    userRecId, 
    action,
    playlistId,
  ) {
    const currentDateTime = getDateTimeNow();

    const query = {
      text: 'INSERT INTO playlist_song_activities (playlist_id, song_id, user_id, action, time) VALUES ($1, $2, $3, $4, $5) RETURNING rec_id',
      values: [
        playlistRecId,
        songRecId,
        userRecId,
        action,
        currentDateTime,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(ExceptionTypeEnum.ACTIVITY_FAILED_TO_CREATE.defaultMessage);
    }

    await this._cacheService.delete(CacheKeyEnum.PLAYLIST_ACTIVITIES.getFinalKey(playlistId));
  }

  async getPlaylistSongActivites(playlistId) {
    const cacheKey = CacheKeyEnum.PLAYLIST_ACTIVITIES.getFinalKey(playlistId);

    const fetchFromDb = async ()  => {
      const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time
      FROM playlist_song_activities psa
      JOIN playlists p ON p.rec_id = psa.playlist_id
      JOIN songs s ON s.rec_id = psa.song_id
      JOIN users u ON u.rec_id = psa.user_id
      WHERE p.public_id = $1
      ORDER BY psa.rec_id
      `,
      values: [playlistId],
    };

    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(ExceptionTypeEnum.PLAYLIST_NOT_EXIST.defaultMessage);
    }

    return rows;
    }

    const result = await this._cacheService.getOrSet(cacheKey, fetchFromDb);
    return result
  }
}

export default PlaylistsService;
