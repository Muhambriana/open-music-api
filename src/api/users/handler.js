import autoBind from 'auto-bind';
import ResponseTypeEnum from '../../config/ResponseTypeEnum.js';

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;
    const userId = await this._service.addUser({ username, password, fullname });

    const response = h.response({
      status: ResponseTypeEnum.SUCCESS.defaultMessage,
      message: ResponseTypeEnum.USER_SUCCESSFULLY_CREATED.defaultMessage,
      data: {
        userId,
      },
    });

    response.code(ResponseTypeEnum.USER_SUCCESSFULLY_CREATED.code);
    return response;
  }
}

export default UserHandler;
