import Joi from 'joi';
import { yearSchema, stringRequired } from '../DataValidator.js';

const AlbumPayloadSchema = Joi.object({
  name: stringRequired,
  year: yearSchema,
});

export default AlbumPayloadSchema;
