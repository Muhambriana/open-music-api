class CacheKeyEnum {
  constructor(key) {
    this.key = key;
  }

  getFinalKey(additionalKey) {
    return this.key.replace('{additionalKey}', additionalKey);
  }

  static ALBUM_LIKES = new CacheKeyEnum('album-likes:{additionalKey}');
}

Object.freeze(CacheKeyEnum); // Prevent further modification

export default CacheKeyEnum;
