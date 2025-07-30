import SongHandler from './handler.js';
import routes from './routes.js';

const songsPlugin = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, {
    songsService,
    albumsService,
    validator,
  }) => {
    const songsHandler = new SongHandler(songsService, albumsService, validator);
    server.route(routes(songsHandler));
  },
};

export default songsPlugin;
