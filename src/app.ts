import path from "path";
import dotenv from "dotenv";

// Initializing environment variables
const mode = process.env.NODE_ENV === "production" ? "production" : "development";
console.log(`Running in mode: ${mode}`);
dotenv.config({
  path:path.join(__dirname, `../.env.${mode}`)
});

import express from "express";
import cors from "cors";
import router from "./routes/router";
import { sequelize } from "./config/db";
import { setupDatabase } from "./utils/dbSetup";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();
const port = process.env.PORT;

let force = mode === "development" ? true : false;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(router);
app.use(globalErrorHandler);

// force = true;

async function main() {
  // await sequelize.drop();
  await sequelize.sync({ force: force});
  console.log("Connected to DB");
  await setupDatabase();
  console.log("Database set up");
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}. Visit http://localhost:${port} to check the API!`);
  });
}

main();
