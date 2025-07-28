import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import ClientError from './exceptions/ClientError.js';

// Albums
import AlbumsService from './services/postgres/AlbumsService.js';
import AlbumsValidator from './validator/albums/index.js';
import albumsPlugin from './api/albums/index.js';

// Songs
import SongsService from './services/postgres/SongsService.js';
import SongsValidator from './validator/songs/index.js';
import songsPlugin from './api/songs/index.js';

// Users
import UsersService from './services/postgres/UsersService.js';
import UserValidator from './validator/users/index.js';
import usersPlugin from './api/users/index.js';

// Authentications
import AuthenticationsService from './services/postgres/AuthenticationsService.js';
import AuthenticationsValidator from './validator/authentications/index.js';
import authenticationsPlugin from './api/authentications/index.js';
import TokenManager from './api/tokenize/TokenManager.js';

dotenv.config();

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  albumsService.setSongsService(songsService);
  songsService.setAlbumsService(albumsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albumsPlugin,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
    {
      plugin: authenticationsPlugin,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
