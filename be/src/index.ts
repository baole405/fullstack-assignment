import repository from "./data/repos";
import { createServer } from "./server";

const server = createServer();

const port = process.env.PORT || 5000;

server.listen(port, async () => {
  try {
    await repository.sequelizeClient.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Failed to connect database:", error);
  }
  console.log(`API is running on port ${port}`);
});
