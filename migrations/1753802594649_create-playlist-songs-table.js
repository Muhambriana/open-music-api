/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('playlist_songs', {
    rec_id: {
      type: 'serial',
      primaryKey: true,
    },
    playlist_id: {
      type: 'integer',
      notNull: true,
      references: 'playlists(rec_id)',
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
    song_id: {
      type: 'integer',
      notNull: true,
      references: 'songs(rec_id)',
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  });

  pgm.addConstraint('playlist_songs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
