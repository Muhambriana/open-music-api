/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
  album_id,
  name,
  year,
}) => ({
  id: album_id,
  name,
  year,
});

const mapSongDBToModel = ({
  song_id,
  title,
  year,
  performer,
  genre,
  duration,
}) => ({
  id: song_id,
  title,
  year,
  performer,
  genre,
  duration,
});

const mapAlbumWithSongDBToModel = ({
  album_id,
  name,
  year,
  songs = [],
}) => ({
  id: album_id,
  name,
  year,
  songs: songs.map(mapSongDBToModel),
});

export { mapAlbumDBToModel, mapSongDBToModel, mapAlbumWithSongDBToModel };
