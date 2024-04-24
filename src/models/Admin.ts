import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";
import { UUID } from "crypto";

class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
    declare id: ForeignKey<UUID>;
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
        name: "id",
        allowNull: false,
    },
    onDelete: "CASCADE",
});

User.hasOne(Admin, {
    foreignKey: {
        name: "id",
        allowNull: false,
    },
    onDelete: "CASCADE",
});

export default Admin;