import InvariantError from '../../exceptions/InvariantError';
import AlbumPayloadSchema from './schema';

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.errorMessage);
    }
  },
};

export default AlbumsValidator;
