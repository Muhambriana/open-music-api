import Joi from 'joi';
import { stringRequired } from '../DataValidator.js';

const PlaylistPayloadSchema = Joi.object({
  name: stringRequired,
});

export default PlaylistPayloadSchema;
