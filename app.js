import express from "express";
import { PORT } from "./environment.js";
import cors from "cors";
import { sequelize_write } from "./config/db.js";
import { createServer } from "http";
import router from "./src/routes/routes.js";
import "./src/model/associations.js";


const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(cors());
app.use(router)

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("The API status is UP");
});

async function main() {
  await sequelize_write.sync({ force: false });
  console.log("Connected to write DB");

  // app.listen(PORT, () => {
  //   console.log(
  //     `App is listening to port: ${PORT} at http://localhost:${PORT}`
  //   );
  // });

  httpServer.listen(PORT, () => {
    console.log(
      `App is listening to port: ${PORT} at http://localhost:${PORT}`
    );
  });
}

main();
