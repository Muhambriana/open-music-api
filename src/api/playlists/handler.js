import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../config/SuccessTypeEnum.js';

class PlaylistsHandler {
  constructor(playlistsService, usersService, validator) {
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const user = await this._usersService.getUserById(credentialId);
    const playlistId = await this._playlistsService.addPlaylist({ name, owner: user.rec_id });

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

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const user = await this._usersService.getUserById(credentialId);
    const playlists = await this._playlistsService.getPlaylistsByUserId(user.rec_id);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      data: {
        playlists,
      },
    };
  }
}

export default PlaylistsHandler;
