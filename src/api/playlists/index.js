import PlaylistsHandler from './handler.js';
import routes from './routes.js';

const playlistPlugin = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistsService,
    usersService,
    validator,
  }) => {
    const playlisyHandler = new PlaylistsHandler(playlistsService, usersService, validator);
    server.route(routes(playlisyHandler));
  },
};

export default playlistPlugin;
