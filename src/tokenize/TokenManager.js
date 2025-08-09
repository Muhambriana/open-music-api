import Jwt from '@hapi/jwt';
import InvariantError from '../exceptions/InvariantError.js';
import ExceptionTypeEnum from '../utils/config/ExceptionTypeEnum.js';

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError(ExceptionTypeEnum.INVALID_REFRESH_TOKEN.defaultMessage);
    }
  },
};

export default TokenManager;
