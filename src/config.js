/**
 * Application configuration.
 *
 * @module config
 * @type {Object}
 */
module.exports = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.API_HOST || 'localhost',
  apiPort: process.env.API_PORT,
  isProduction: process.env.NODE_ENV === 'production',
  app: {
    title: 'UMA Data Warehouse',
    description: 'UMA Data Warehouse'
  },
  env: {
    httpsEnabled: Object.prototype.hasOwnProperty.call(process.env, 'HTTPS_ENABLED')
      ? (process.env.HTTPS_ENABLED === true || process.env.HTTPS_ENABLED === 'true')
      : window.location.protocol.indexOf('https') > -1
  }
};
