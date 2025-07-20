import Joi from 'joi';

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1900) //  Assuming albums cannot be older than 1900
    .max(new Date().getFullYear()) //  Assuming albums cannot be from the future
    .required(),
});

export default AlbumPayloadSchema;
