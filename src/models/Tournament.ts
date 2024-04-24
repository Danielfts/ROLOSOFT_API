import { UUID } from "crypto";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../config/db";

class Tournament extends Model<InferAttributes<Tournament>, InferCreationAttributes<Tournament>>{
    declare id: CreationOptional<UUID>;
    declare name: string;
    declare startDate: Date;
    declare endDate: Date;
    declare address: string;
}

Tournament.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: "Tournaments",
    modelName: "Tournament",
    timestamps: true,
    paranoid: true
})

export default Tournament;