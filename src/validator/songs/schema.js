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

const SongQuerySchema = Joi.object({
  title: Joi.string().empty(''),
  performer: Joi.string().empty(''),
});

export { SongPayloadSchema, SongQuerySchema };
