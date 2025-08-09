import ExportsHandler from './handler.js';
import routes from './routes.js';

const exportPlugin = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const exportsHandler = new ExportsHandler(service, validator);
    server.route(routes(exportsHandler));
  },
};

export default exportPlugin;
