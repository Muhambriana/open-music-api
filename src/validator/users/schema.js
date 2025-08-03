import Joi from 'joi';
import { stringRequired } from '../DataValidator.js';

const UserPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: stringRequired,
  fullname: stringRequired,
});

export default UserPayloadSchema;
