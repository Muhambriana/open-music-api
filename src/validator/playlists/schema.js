import Joi from 'joi';
import { stringRequired } from '../DataValidator.js';

const PostPlaylistPayloadSchema = Joi.object({
  name: stringRequired,
});

const PostSongIntoPlaylistSchema = Joi.object({
  songId: stringRequired,
});

const DeletePlaylistSongSchema = Joi.object({
  songId: stringRequired,
});

export { PostPlaylistPayloadSchema, PostSongIntoPlaylistSchema, DeletePlaylistSongSchema };
