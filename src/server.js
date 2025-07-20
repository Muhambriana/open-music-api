import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import AlbumsService from './services/postgres/albums/AlbumsService';
import AlbumsValidator from './validator/albums';
import ClientError from './exceptions/ClientError';
import albumsPlugin from './api/albums';

dotenv.config();

const init = async () => {
  const albumsService = new AlbumsService();

  const server = Hapi.server({
    port: process.env.POST,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugins: albumsPlugin,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

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
