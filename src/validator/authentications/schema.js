import Joi from 'joi';
import { stringRequired } from '../DataValidator.js';

const PostAuthenticationPayloadSchema = Joi.object({
  username: stringRequired,
  password: stringRequired,
});

export default PostAuthenticationPayloadSchema;
