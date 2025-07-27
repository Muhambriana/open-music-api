/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
  public_id,
  name,
  year,
}) => ({
  id: public_id,
  name,
  year,
});

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

const mapAlbumWithSongDBToModel = ({
  public_id,
  name,
  year,
  songs = [],
}) => ({
  id: public_id,
  name,
  year,
  songs,
});

export { mapAlbumDBToModel, mapSongDBToModel, mapAlbumWithSongDBToModel };
