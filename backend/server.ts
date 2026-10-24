import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import { env } from "./src/config/env.js";
import connectToDB from "./src/config/database.js";

const server = http.createServer(app);

const port = env.PORT;

const startServer = async (): Promise<void> => {
  try {
    await connectToDB();

    server.listen(port, () => {
      console.log(`Server is up and running on port ${port}`);
    });
  } catch (error: unknown) {
    console.error("Application startup failed: ", error);
    process.exitCode = 1;
  }
};

void startServer();
