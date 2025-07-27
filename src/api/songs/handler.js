import autoBind from 'auto-bind';
import ResponseTypeEnum from '../../config/ResponseTypeEnum.js';

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: ResponseTypeEnum.SUCCESS.defaultMessage,
      message: ResponseTypeEnum.SONG_SUCCESSFULLY_CREATED.defaultMessage,
      data: {
        songId,
      },
    });

    response.code(ResponseTypeEnum.SONG_SUCCESSFULLY_CREATED.code);
    return response;
  }

  async getSongsHandler(request) {
    const { title = '', performer = '' } = request.query;

    await this._validator.validateSongQuery({ title, performer });

    const songs = await this._service.getSongs(title, performer);

    return {
      status: ResponseTypeEnum.SUCCESS.defaultMessage,
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { songId } = request.params;

    const song = await this._service.getSongById(songId);

    return {
      status: ResponseTypeEnum.SUCCESS.defaultMessage,
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);

    const { songId } = request.params;

    await this._service.editSongById(songId, request.payload);

    return {
      status: ResponseTypeEnum.SUCCESS.defaultMessage,
      message: ResponseTypeEnum.SONG_UPDATED_SUCCESSFULLY.defaultMessage,
    };
  }

  async deleteSongByIdHandler(request) {
    const { songId } = request.params;

    await this._service.deleteSongById(songId);

    return {
      status: ResponseTypeEnum.SUCCESS.defaultMessage,
      message: ResponseTypeEnum.SONG_DELETED_SUCCESSFULLY.defaultMessage,
    };
  }
}

export default SongHandler;
