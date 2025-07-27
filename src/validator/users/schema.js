import Joi from 'joi';
import { stringRequired } from '../DataValidator.js';

const UserPayloadSchema = Joi.object({
  username: stringRequired,
  password: stringRequired,
  fullname: stringRequired,
});

export default UserPayloadSchema;
