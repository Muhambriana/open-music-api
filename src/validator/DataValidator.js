import Joi from 'joi';

const yearSchema = Joi.number()
  .integer()
  .min(1900) //  Assuming albums cannot be older than 1900
  .max(new Date().getFullYear()) //  Assuming albums cannot be from the future
  .required();

const stringRequired = Joi.string().required();

const numberRequired = Joi.number().required();

const stringOptionalAndNull = Joi.string().optional().allow(null);

const numberOptionalAndNull = Joi.number().optional().allow(null);

export {
  yearSchema,
  stringRequired,
  numberRequired,
  stringOptionalAndNull,
  numberOptionalAndNull,
};
