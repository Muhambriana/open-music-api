import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import InvariantError from '../../exceptions/InvariantError.js';
import ExceptionTypeEnum from '../../config/ExceptionTypeEnum.js';

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users (public_id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING public_id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(ExceptionTypeEnum.USER_FAILED_TO_CREATE.defaultMessage);
    }

    return result.rows[0].public_id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError(ExceptionTypeEnum.USER_ALREADY_EXIST.defaultMessage);
    }
  }
}

export default UsersService;
