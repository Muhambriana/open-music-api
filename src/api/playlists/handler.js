import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../utils/config/SuccessTypeEnum.js';

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

    const userId = await this._usersService.getUserRecordId(credentialId);
    const playlistId = await this._playlistsService.addPlaylist({ name, owner: userId });

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
    const playlists = await this._playlistsService.getPlaylistsByUserId(credentialId);

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

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylistById(playlistId);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_DELETED.message('Playlist'),
    };
  }

  async postSongIntoPlaylistHandler(request, h) {
    this._validator.validatePostSongIntoPlaylistPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlistRecId = await this._playlistsService.getPlaylistRecordId(playlistId);
    const songRecId = await this._songsService.getSongRecordId(songId);
    const userRecId = await this._usersService.getUserRecordId(credentialId);

    await this._playlistsService.addSongIntoPlaylist(playlistRecId, songRecId);
    await this._playlistsService.addActivity(playlistRecId, songRecId, userRecId, 'add');

    const response = h.response({
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_CREATED.message('Song into playlist'),
    });

    response.code(SuccessTypeEnum.SUCCESSFULLY_CREATED.code);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistsService.getPlaylistSongs(playlistId);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deletePlaylistSongByIdHandler(request) {
    this._validator.validateDeletePlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { songId } = request.payload;

    const userRecId = await this._usersService.getUserRecordId(credentialId);

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const deletedData = await this._playlistsService.deletePlaylistSongById(playlistId, songId);

    await this._playlistsService.addActivity(
      deletedData.playlist_rec_id,
      deletedData.song_rec_id,
      userRecId,
      'delete',
    );

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_DELETED.message('Song'),
    };
  }

  async getPlaylistSongActivitesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._playlistsService.getPlaylistSongActivites(playlistId);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      data: {
        playlistId,
        activities,
      },
    };
  }
}

export default PlaylistsHandler;
