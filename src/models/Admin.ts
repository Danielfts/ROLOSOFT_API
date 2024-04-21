import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";

class Admin extends Model {};

Admin.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: User,
                key: "id",
            }
        },

        ine: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: "Admin",
        modelName: "Admin",
    }
)

Admin.belongsTo(User, {
    foreignKey: {
        name: "user",
        allowNull: false,
    },
});

export default Admin;