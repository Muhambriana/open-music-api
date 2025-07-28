class ExceptionTypeEnum {
  constructor(code, key, defaultMessage) {
    this.code = code;
    this.key = key;
    this.defaultMessage = defaultMessage;
  }

  static INVALID_CREDENTIAL = new ExceptionTypeEnum(601, 'invalid_credential', 'Invalid credential');

  static SONG_NOT_EXIST = new ExceptionTypeEnum(601, 'song_not_exist', 'Song not exist');

  static ALBUM_NOT_EXIST = new ExceptionTypeEnum(602, 'album_not_exist', 'Album not exist');

  static SONG_FAILED_TO_CREATE = new ExceptionTypeEnum(603, 'song_failed_to_create', 'Song failed to create');

  static ALBUM_FAILED_TO_CREATE = new ExceptionTypeEnum(604, 'album_failed_to_create', 'Album failed to create');

  static USER_ALREADY_EXIST = new ExceptionTypeEnum(605, 'user_already_exist', 'User already exist');

  static USER_FAILED_TO_CREATE = new ExceptionTypeEnum(606, 'user_failed_to_create', 'User failed to create');
}

Object.freeze(ExceptionTypeEnum); // Prevent further modification

export default ExceptionTypeEnum;
