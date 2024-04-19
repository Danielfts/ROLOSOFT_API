import { Sequelize } from "sequelize";

const dbName : string = process.env.DB_NAME || "";
const dbUsername : string = process.env.DB_USERNAME || "";
const dbPassword : string = process.env.DB_PASSWORD || "";
const dbHost : string = process.env.DB_HOST || "";
const dbPort : number = parseInt(process.env.DB_PORT || "3306");

export const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHost,
  dialect: "mysql",
  port: dbPort,
});
