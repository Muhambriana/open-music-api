import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../utils/config/SuccessTypeEnum.js';

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    this._validator.validateExportPlaylistSongsPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlistSongs', JSON.stringify(message));

    const response = h.response({
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: 'Your request has been in queue',
    });

    response.code(201);
    return response;
  }
}

export default ExportsHandler;
