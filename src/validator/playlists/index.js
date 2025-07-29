import InvariantError from '../../exceptions/InvariantError.js';
import { PostPlaylistPayloadSchema, PostSongIntoPlaylistSchema } from './schema.js';

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostSongIntoPlaylistPayload: (payload) => {
    const validationResult = PostSongIntoPlaylistSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default PlaylistsValidator;
