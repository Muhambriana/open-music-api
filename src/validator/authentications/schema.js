import Joi from 'joi';
import { stringRequired } from '../DataValidator.js';

const PostAuthenticationPayloadSchema = Joi.object({
  username: stringRequired,
  password: stringRequired,
});

const PutAuthenticatioPayloadSchema = Joi.object({
  refreshToken: stringRequired,
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export {
  PostAuthenticationPayloadSchema,
  PutAuthenticatioPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
