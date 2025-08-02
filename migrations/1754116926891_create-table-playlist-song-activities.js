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
  pgm.createTable('playlist_song_activities', {
    rec_id: {
      type: 'serial',
      primaryKey: true,
    },
    playlist_id: {
      type: 'integer',
      notNull: true,
      references: 'playlists(rec_id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    song_id: {
      type: 'integer',
      notNull: true,
    },
    user_id: {
      type: 'integer',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
