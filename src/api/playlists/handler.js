import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../config/SuccessTypeEnum.js';

class PlaylistsHandler {
  constructor(playlistsService, songsService, usersService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const user = await this._usersService.getUserById(credentialId);
    const playlistId = await this._playlistsService.addPlaylist({ name, owner: user.rec_id });

    const response = h.response({
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
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

  async deletePlaylistByIdHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const user = await this._usersService.getUserById(credentialId);
    const owner = user.rec_id;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._playlistsService.deletePlaylistById(playlistId, owner);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_DELETED.message('Playlist'),
    };
  }

  async postSongIntoPlaylistHandler(request, h) {
    this._validator.validatePostSongIntoPlaylistPayload(request.payload);
    const { playlistId } = request.params;
    const { songId } = request.payload;

    const existPlaylistId = await this._playlistsService.getPlaylistRecordId(playlistId);
    const existSongId = await this._songsService.getSongRecordId(songId);

    await this._playlistsService.addSongIntoPlaylist(existPlaylistId, existSongId);

    const response = h.response({
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_CREATED.message('Song into playlist'),
    });

    response.code(SuccessTypeEnum.SUCCESSFULLY_CREATED.code);
    return response;
  }
}

export default PlaylistsHandler;
