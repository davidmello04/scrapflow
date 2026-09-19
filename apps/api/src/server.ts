import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

await connectDatabase();
const server = app.listen(env.PORT, () => console.log(`ScrapFlow API running on port ${env.PORT}`));

async function shutdown() {
  server.close();
  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
