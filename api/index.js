const http = require('http');
const app = require('./app');
const config = require('./config');

const port = config.port || 3200;

const server = http.createServer(app);

server.listen(port);