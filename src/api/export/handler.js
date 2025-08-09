import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../utils/config/SuccessTypeEnum.js';

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    this._validator.validateExportPlaylistSongsPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const message = { playlistId, targetEmail };

    await this._producerService.sendMessage('export:playlistSongs', JSON.stringify(message));

    const response = h.response({
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: 'Your request has been in queue',
    });

    response.code(201);
    return response;
  }
}

export default ExportsHandler;
