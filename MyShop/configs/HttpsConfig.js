const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const HttpsConfig = (app, dir) => {
  const server = https.createServer({
    key: process.env.PRIVATE_KEY,
    cert: process.env.CERT_KEY,
  }, app);
  return server;
};

module.exports = HttpsConfig;
