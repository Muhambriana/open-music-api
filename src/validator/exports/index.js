import InvariantError from '../../exceptions/InvariantError.js';
import ExportPlaylistSongsPayloadSchema from './schema.js';

const ExportsValidator = {
  validateExportPlaylistSongsPayload: (payload) => {
    const validationResult = ExportPlaylistSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default ExportsValidator;
