import config from "./config";
import repository from "./data/repos";
import { createServer } from "./server";

const server = createServer();
const port = config.app.port;

server.listen(port, async () => {
  try {
    await repository.sequelizeClient.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Failed to connect database:", error);
  }

  console.log(`API is running on port ${port}`);
});
