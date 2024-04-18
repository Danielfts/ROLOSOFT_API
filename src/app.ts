import express from "express";
import cors from "cors";
import router from "./routes/router";
import { sequelize } from "./config/db";


const app = express();
const port = 5555;

// MIDDLEWARES

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(router);

async function main() {

    await sequelize.sync({ force: false });
    console.log("Connected to DB");
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}. Visit http://localhost:${port} to check the API!`);
        });
}

main();