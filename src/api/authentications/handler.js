import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../config/SuccessTypeEnum.js';

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this._usersService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_CREATED.message('Authentication'),
      data: {
        accessToken,
        refreshToken,
      },
    });

    response.code(SuccessTypeEnum.SUCCESSFULLY_CREATED.code);
    return response;
  }
}

export default AuthenticationsHandler;
