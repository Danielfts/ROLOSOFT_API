import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const name: string = process.env.DB_NAME_WRITE || "";
const user: string = process.env.DB_USER_WRITE || "";
const password: string = process.env.DB_PASSWORD_WRITE || "";
const host: string = process.env.DB_HOST_WRITE || "";
const port: number = parseInt(process.env.DB_PORT_WRITE || "3306");

export const sequelize = new Sequelize(name, user, password, {
  host: host,
  dialect: "mysql",
  port: port,
});
