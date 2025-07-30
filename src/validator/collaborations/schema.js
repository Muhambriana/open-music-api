import Joi from 'joi';
import { stringRequired } from '../DataValidator.js';

const CollaborationPayloadSchema = Joi.object({
  playlistId: stringRequired,
  userId: stringRequired,
});

export default CollaborationPayloadSchema;
