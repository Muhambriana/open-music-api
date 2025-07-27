class ResponseTypeEnum {
  constructor(code, key, defaultMessage) {
    this.code = code;
    this.key = key;
    this.defaultMessage = defaultMessage;
  }

  static SUCCESS = new ResponseTypeEnum(200, 'ok', 'success');

  static SONG_NOT_EXIST = new ResponseTypeEnum(601, 'song_not_exist', 'Song not exist');

  static ALBUM_NOT_EXIST = new ResponseTypeEnum(602, 'album_not_exist', 'Album not exist');

  static SONG_FAILED_TO_CREATE = new ResponseTypeEnum(603, 'song_failed_to_create', 'Song failed to create');

  static ALBUM_FAILED_TO_CREATE = new ResponseTypeEnum(604, 'album_failed_to_create', 'Album failed to create');

  static USER_ALREADY_EXIST = new ResponseTypeEnum(605, 'user_already_exist', 'User already exist');

  static USER_FAILED_TO_CREATE = new ResponseTypeEnum(606, 'user_failed_to_create', 'User failed to create');

  static SONG_SUCCESSFULLY_CREATED = new ResponseTypeEnum(201, 'song_successfully_created', 'Song created successfully');

  static ALBUM_SUCCESSFULLY_CREATED = new ResponseTypeEnum(201, 'album_successfully_created', 'Album created successfully');

  static USER_SUCCESSFULLY_CREATED = new ResponseTypeEnum(201, 'user_successfully_created', 'User created successfully');

  static SONG_UPDATED_SUCCESSFULLY = new ResponseTypeEnum(200, 'song_updated_successfully', 'Song updated successfully');

  static ALBUM_UPDATED_SUCCESSFULLY = new ResponseTypeEnum(200, 'album_updated_successfully', 'Album updated successfully');

  static SONG_DELETED_SUCCESSFULLY = new ResponseTypeEnum(200, 'song_deleted_successfully', 'Song deleted successfully');

  static ALBUM_DELETED_SUCCESSFULLY = new ResponseTypeEnum(200, 'album_deleted_successfully', 'Album deleted successfully');
}

Object.freeze(ResponseTypeEnum); // Prevent further modification

export default ResponseTypeEnum;
