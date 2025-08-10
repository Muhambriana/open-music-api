import AlbumsHandler from './handler.js';
import routes from './routes.js';

const albumsPlugin = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    albumsService,
    songsService,
    storageService,
    usersService,
    validator,
  }) => {
    const albumsHandler = new AlbumsHandler(
      albumsService,
      songsService,
      storageService,
      usersService,
      validator,
    );
    server.route(routes(albumsHandler));
  },
};

export default albumsPlugin;
