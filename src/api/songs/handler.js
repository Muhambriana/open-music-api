import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../config/SuccessTypeEnum.js';

class SongsHandler {
  constructor(songsService, albumsService, validator) {
    this._songsService = songsService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const { albumId: publicId, ...restPayload } = request.payload;

    const albumId = publicId ? await this._albumsService.getAlbumRecordId(publicId) : null;

    const songId = await this._songsService.addSong({ albumId, ...restPayload });

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

    const songs = await this._songsService.getSongs(title, performer);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { songId } = request.params;

    const song = await this._songsService.getSongById(songId);

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
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId: publicId,
    } = request.payload;

    const albumId = publicId ? await this._albumsService.getAlbumRecordId(publicId) : null;

    await this._songsService.editSongById(songId, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_UPDATED.message('Song'),
    };
  }

  async deleteSongByIdHandler(request) {
    const { songId } = request.params;

    await this._songsService.deleteSongById(songId);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_DELETED.message('Song'),
    };
  }
}

export default SongsHandler;
