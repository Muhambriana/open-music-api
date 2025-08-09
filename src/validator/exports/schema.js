import Joi from 'joi';

const ExportPlaylistSongsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

export default ExportPlaylistSongsPayloadSchema;
