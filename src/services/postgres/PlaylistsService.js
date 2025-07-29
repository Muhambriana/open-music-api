import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';
// import NotFoundError from '../../exceptions/NotFoundError.js';
import ExceptionTypeEnum from '../../config/ExceptionTypeEnum.js';

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
}

export default PlaylistsService;
