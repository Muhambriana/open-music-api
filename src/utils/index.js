/* eslint-disable camelcase */
const mapSongDBToModel = ({
  public_id,
  title,
  year,
  performer,
  genre,
  duration,
}) => ({
  id: public_id,
  title,
  year,
  performer,
  genre,
  duration,
});

const mapAlbumDBToModel = ({
  public_id,
  name,
  year,
  cover,
}) => ({
  id: public_id,
  name,
  year,
  coverUrl: cover,
});

export { mapSongDBToModel, mapAlbumDBToModel };
