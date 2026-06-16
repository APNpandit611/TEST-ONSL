import app from "./app.js";
import { logger } from "./lib/logger.js";
import { seed } from "./seed.js";
import http from "http";

// Export app for Vercel serverless
export default app;

// Only start server if running locally (not on Vercel)
if (process.env.VERCEL !== "1") {
  const rawPort = process.env["PORT"];

  if (!rawPort) {
    throw new Error(
      "PORT environment variable is required but was not provided.",
    );
  }

  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

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