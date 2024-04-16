import { Sequelize } from "sequelize";

export const sequelize_write = new Sequelize(
    "rolosoft",
    "admin",
    "admin",
    {
        host: "localhost",
        dialect : "mysql",
        port: 3306
    }
)