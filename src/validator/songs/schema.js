import Joi from 'joi';
import {
  yearSchema,
  stringRequired,
  stringOptionalAndNull,
  numberOptionalAndNull,
} from '../DataValidator.js';

const SongPayloadSchema = Joi.object({
  title: stringRequired,
  year: yearSchema,
  genre: stringRequired,
  performer: stringRequired,
  duration: numberOptionalAndNull,
  albumId: stringOptionalAndNull,
});

export default SongPayloadSchema;
