import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../config/SuccessTypeEnum.js';

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
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_CREATED.message('Song'),
      data: {
        songId,
      },
    });

    response.code(SuccessTypeEnum.SUCCESSFULLY_CREATED.code);
    return response;
  }

  async getSongsHandler(request) {
    const { title = '', performer = '' } = request.query;

    await this._validator.validateSongQuery({ title, performer });

    const songs = await this._service.getSongs(title, performer);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { songId } = request.params;

    const song = await this._service.getSongById(songId);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
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
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_UPDATED.message('Song'),
    };
  }

  async deleteSongByIdHandler(request) {
    const { songId } = request.params;

    await this._service.deleteSongById(songId);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_DELETED.message('Song'),
    };
  }
}

export default SongHandler;
