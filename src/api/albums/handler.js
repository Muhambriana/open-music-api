import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../config/SuccessTypeEnum.js';

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_CREATED.message('Album'),
      data: {
        albumId,
      },
    });
    response.code(SuccessTypeEnum.SUCCESSFULLY_CREATED.code);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { albumId } = request.params;
    const album = await this._service.getAlbumAndSongsByAlbumId(albumId);
    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { albumId } = request.params;

    await this._service.editAlbumById(albumId, request.payload);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_UPDATED.message('Album'),
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { albumId } = request.params;

    await this._service.deleteAlbumById(albumId);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_DELETED.message('Album'),
    };
  }
}

export default AlbumHandler;
