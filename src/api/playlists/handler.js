import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../config/SuccessTypeEnum.js';

class PlaylistsHandler {
  constructor(service, usersService, validator) {
    this._service = service;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const user = await this._usersService.getUserById(credentialId);
    const playlistId = await this._service.addPlaylist({ name, owner: user.rec_id });

    const response = h.response({
      status: SuccessTypeEnum.SUCCESS.code,
      message: SuccessTypeEnum.SUCCESSFULLY_CREATED.message('Playlist'),
      data: {
        playlistId,
      },
    });

    response.code(SuccessTypeEnum.SUCCESSFULLY_CREATED.code);
    return response;
  }
}

export default PlaylistsHandler;
