import { Pool } from 'pg';
import { generateNanoid } from '../../utils/helper.js';
import InvariantError from '../../exceptions/InvariantError.js';
import ExceptionTypeEnum from '../../config/ExceptionTypeEnum.js';

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
}

export default CollaborationsService;
