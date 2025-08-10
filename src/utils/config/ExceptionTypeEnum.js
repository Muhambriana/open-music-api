class ExceptionTypeEnum {
  constructor(code, key, defaultMessage) {
    this.code = code;
    this.key = key;
    this.defaultMessage = defaultMessage;
  }

  static INVALID_CREDENTIAL = new ExceptionTypeEnum(401, 'invalid_credential', 'Invalid credential');

  static INVALID_REFRESH_TOKEN = new ExceptionTypeEnum(401, 'invalid_refresh_token', 'Invalid refresh token');

  static NOT_AUTHORIZED = new ExceptionTypeEnum(403, 'not_authorized', 'Not Authorized');

  static SONG_NOT_EXIST = new ExceptionTypeEnum(601, 'song_not_exist', 'Song not exist');

  static ALBUM_NOT_EXIST = new ExceptionTypeEnum(602, 'album_not_exist', 'Album not exist');

  static SONG_FAILED_TO_CREATE = new ExceptionTypeEnum(603, 'song_failed_to_create', 'Song failed to create');

  static ALBUM_FAILED_TO_CREATE = new ExceptionTypeEnum(604, 'album_failed_to_create', 'Album failed to create');

  static USER_ALREADY_EXIST = new ExceptionTypeEnum(605, 'user_already_exist', 'User already exist');

  static USER_FAILED_TO_CREATE = new ExceptionTypeEnum(606, 'user_failed_to_create', 'User failed to create');

  static PLAYLIST_FAILED_TO_CREATE = new ExceptionTypeEnum(607, 'playlist_failed_to_create', 'Playlist failed to create');

  static USER_NOT_EXIST = new ExceptionTypeEnum(608, 'user_not_exist', 'User not exist');

  static PLAYLIST_NOT_EXIST = new ExceptionTypeEnum(609, 'playlist_not_exist', 'Playlist not exist');

  static FAILED_ADD_SONG_INTO_PLAYLIST = new ExceptionTypeEnum(610, 'failed_add_song_into_playlist', 'Failed add song into playlist');

  static FAILED_ADD_COLABORATION = new ExceptionTypeEnum(611, 'failed_add_collaboration', 'Failed add collaboration');

  static FAILED_COLLABORATION_VERIFICATION = new ExceptionTypeEnum(612, 'failed_collaboration_verification', 'Failed collaboration verification');

  static ACTIVITY_FAILED_TO_CREATE = new ExceptionTypeEnum(613, 'activity_failed_to_create', 'Activity failed to create');

  static FAILED_UPDATE_ALBUM_COVER = new ExceptionTypeEnum(614, 'failed_update_album_cover', 'Failed update album cover');

  static FAILED_ADD_ALBUM_LIKE = new ExceptionTypeEnum(615, 'failed_add_album_like', 'Failed add like');

  static FAILED_DELETE_ALBUM_LIKE = new ExceptionTypeEnum(615, 'failed_delete_album_like', 'Failed delete like');

  static USER_ALREADY_LIKED_ALBUM = new ExceptionTypeEnum(616, 'already_liked_album', 'You have already liked this album');
}

Object.freeze(ExceptionTypeEnum); // Prevent further modification

export default ExceptionTypeEnum;
