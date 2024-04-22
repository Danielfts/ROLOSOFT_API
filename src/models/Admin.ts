import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";

class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
    declare id: string;
    declare ine: string;
    declare user: NonAttribute<User>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

};

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
        },

        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        
        },
        deletedAt: {
            type: DataTypes.DATE
        },
    },
    {
        sequelize,
        timestamps: true, 
        tableName: "Admin",
        modelName: "Admin",
        paranoid: true,
    }
)

Admin.belongsTo(User, {
    foreignKey: {
        name: "user",
        allowNull: false,
    },
});

export default Admin;