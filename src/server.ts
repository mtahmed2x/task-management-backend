import http from "http";
import app from "./app";
import { config } from "./config/index";
import { initSocket } from "./socket";

const server = http.createServer(app);

async function startServer() {
  try {
    server.listen(config.app.port, () => {
      console.log(`🚀 Server running on port ${config.app.port}`);
    });

    initSocket(server);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
