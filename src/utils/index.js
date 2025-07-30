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

export default mapSongDBToModel;
