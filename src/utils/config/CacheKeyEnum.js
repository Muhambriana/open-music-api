class CacheKeyEnum {
  constructor(key) {
    this.key = key;
  }

  getFinalKey(additionalKey) {
    return this.key.replace('{additionalKey}', additionalKey);
  }

  static ALBUM_LIKES = new CacheKeyEnum('album-likes:{additionalKey}');

  static PLAYLIST_SONGS = new CacheKeyEnum('playlists-songs:{additionalKey}');

  static PLAYLIST_ACTIVITIES = new CacheKeyEnum('playlists-activities:{additionalKey}');

  static SONGS = new CacheKeyEnum('songs');
}

Object.freeze(CacheKeyEnum); // Prevent further modification

export default CacheKeyEnum;
