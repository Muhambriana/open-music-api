import Joi from 'joi';
import { yearSchema, stringRequired } from '../DataValidator.js';

const AlbumPayloadSchema = Joi.object({
  name: stringRequired,
  year: yearSchema,
});

const AlbumCoverHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', ' image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

export { AlbumPayloadSchema, AlbumCoverHeadersSchema };
