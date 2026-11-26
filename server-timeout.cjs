/* eslint-disable @typescript-eslint/no-require-imports */
// Node memutus request yang belum terkirim penuh setelah 5 menit, jadi upload besar berhenti di tengah jalan.
// server.js bawaan Next tidak punya pengaturannya, maka dimuat lebih dulu lewat `node --require` (lihat Dockerfile).
// Samakan dengan batas waktu di proxy (1 jam).
const http = require('node:http');

const createServer = http.createServer;
http.createServer = (...args) => {
  const server = createServer(...args);
  server.requestTimeout = 60 * 60 * 1000;
  return server;
};
