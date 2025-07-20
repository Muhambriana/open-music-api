import InvariantError from '../../exceptions/InvariantError.js';
import AlbumPayloadSchema from './schema.js';

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.errorMessage);
    }
  },
};

export default AlbumsValidator;
