let package = require('../package');
module.exports = {
  app: {
    name: package.name,
    version: package.version
  },
  server: {
    port: process.env.NODE_APP_INSTANCE || 3000,
    lifeTime: process.env.NODE_LIFE_TIME || '',
    proxy_app: false,
    proxy_resource: false
  }
};
