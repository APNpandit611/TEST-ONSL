import app from "./app.js";
import { logger } from "./lib/logger.js";
import { seed } from "./seed.js";
import http from "http";

// Export app for Vercel serverless
export default app;

// Only start server if running locally
if (process.env.VERCEL !== "1") {
  const port = Number(process.env.PORT) || 3000;

  seed().then(() => {
    const server = http.createServer(app);
    server.listen(port, () => {
      logger.info({ port }, "Server listening");
    });
    server.on("error", (err: Error) => {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    });
  });
}
