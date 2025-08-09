import { Pool } from 'pg';
import { generateNanoid } from '../../utils/helper.js';
import InvariantError from '../../exceptions/InvariantError.js';
import ExceptionTypeEnum from '../../utils/config/ExceptionTypeEnum.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const collaborationId = generateNanoid('collab');

    const query = {
      text: 'INSERT INTO collaborations (public_id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING public_id',
      values: [collaborationId, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(ExceptionTypeEnum.FAILED_ADD_COLABORATION.defaultMessage);
    }

    return result.rows[0].public_id;
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: `SELECT * 
      FROM collaborations c
      JOIN playlists p ON p.rec_id = c.playlist_id
      JOIN users u ON u.rec_id = c.user_id
      WHERE p.public_id = $1 AND u.public_id = $2`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(ExceptionTypeEnum.FAILED_COLLABORATION_VERIFICATION.defaultMessage);
    }
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: `DELETE
      FROM collaborations c
      USING playlists p, users u
      WHERE p.rec_id = c.playlist_id
        AND u.rec_id = c.user_id
        AND p.public_id = $1 
        AND u.public_id = $2  
      RETURNING c.rec_id
      `,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist or User is not exist');
    }
  }
}

export default CollaborationsService;
