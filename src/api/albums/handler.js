import autoBind from 'auto-bind';
import SuccessTypeEnum from '../../utils/config/SuccessTypeEnum.js';

class AlbumsHandler {
  constructor(albumsService, songsService, storageService, validator) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._albumsService.addAlbum({ name, year });

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
    const album = await this._albumsService.getAlbumById(albumId);
    const songs = await this._songsService.getSongsByAlbumId(albumId);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      data: {
        album: {
          ...album,
          songs,
        },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { albumId } = request.params;

    await this._albumsService.editAlbumById(albumId, request.payload);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_UPDATED.message('Album'),
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { albumId } = request.params;

    await this._albumsService.deleteAlbumById(albumId);

    return {
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: SuccessTypeEnum.SUCCESSFULLY_DELETED.message('Album'),
    };
  }

  async postAlbumCover(request, h) {
    const { cover } = request.payload;
    this._validator.validateAlbumCoverHeaders(cover.hapi.headers);

    const { albumId } = request.params;
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/cover/${filename}`;

    await this._albumsService.updateAlbumCoverById(albumId, fileUrl);

    const response = h.response({
      status: SuccessTypeEnum.SUCCESS.defaultMessage,
      message: 'Succesfully upload cover',
    });

    response.code(201);
    return response;
  }
}

export default AlbumsHandler;
