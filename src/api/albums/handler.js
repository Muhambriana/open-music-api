import autoBind from 'auto-bind';
import ResponseTypeEnum from '../../config/ResponseTypeEnum.js';

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
      status: ResponseTypeEnum.SUCCESS.defaultMessage,
      message: ResponseTypeEnum.ALBUM_SUCCESSFULLY_CREATED.defaultMessage,
      data: {
        albumId,
      },
    });
    response.code(ResponseTypeEnum.ALBUM_SUCCESSFULLY_CREATED.code);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { albumId } = request.params;
    const album = await this._service.getAlbumById(albumId);
    return {
      status: 'success',
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
      status: ResponseTypeEnum.SUCCESS.defaultMessage,
      message: ResponseTypeEnum.ALBUM_UPDATED_SUCCESSFULLY.defaultMessage,
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { albumId } = request.params;

    await this._service.deleteAlbumById(albumId);

    return {
      status: ResponseTypeEnum.SUCCESS.defaultMessage,
      message: ResponseTypeEnum.ALBUM_DELETED_SUCCESSFULLY.defaultMessage,
    };
  }
}

export default AlbumHandler;
