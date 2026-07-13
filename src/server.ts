// src/server.ts
// import express from 'express';
import { config } from './config.js';
import { server } from './app.js';


async function main() {
  // start server
  const port = config.port;
  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

main().catch((e) => {
  console.error("Failed to start server", e);
  process.exit(1);
});
