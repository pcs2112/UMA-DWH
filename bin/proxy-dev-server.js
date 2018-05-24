require('dotenv').config();
const path = require('path');
const http = require('http');
const httpProxy = require('http-proxy');
const Express = require('express');
const compression = require('compression');
const config = require('../src/config');

const apiTargetUrl = `http://${config.apiHost}:${config.apiPort}`;
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: apiTargetUrl,
  ignorePath: true
});

// Disable express settings
app.disable('etag');
app.disable('x-powered-by');

// Set compression
app.use(compression());

// Proxy to API server
app.use('/api', (req, res) => {
  req.url = req.originalUrl;
  proxy.web(req, res, { target: apiTargetUrl, ignorePath: false });
});

// Serve main html page
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', config.isProduction
    ? 'uma_dwh/static/dist/index.html' : 'uma_dwh/static/templates/index.dev.html'));
});

// Added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }

  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  res.end(JSON.stringify({
    status_code: 500,
    type: 'proxy_error',
    message: error.message
  }));
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}

