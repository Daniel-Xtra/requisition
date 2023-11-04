import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import { ALTER_STATE } from "../../config";
import { UserModel } from "../User/userModel";
import { DivisionModel } from "../Division";

export class RequestModel extends Model {}
RequestModel.init(
  {
    item: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    unique_id: {
      type: Sequelize.STRING(100),
      unique: {
        name: "unique_id",
        msg: "Duplicate unique_id",
      },
    },
    qty_required: {
      type: Sequelize.INTEGER,
    },

    purpose: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    requested_by: {
      type: Sequelize.INTEGER,
      references: { model: UserModel, key: "id" },
    },
    qty_approved: {
      type: Sequelize.INTEGER,
    },
    comment: {
      type: Sequelize.STRING,
    },
    approved_by: {
      type: Sequelize.INTEGER,
    },
    qty_issued: {
      type: Sequelize.INTEGER,
    },
    issued_by: {
      type: Sequelize.INTEGER,
    },
  },
  {
    sequelize: DB,
    modelName: "requests",
  }
);

DivisionModel.hasMany(RequestModel);
RequestModel.belongsTo(DivisionModel);

UserModel.hasMany(RequestModel, { foreignKey: "requested_by" });

RequestModel.belongsTo(UserModel, { foreignKey: "requested_by" });

const options: any = {
  alter: ALTER_STATE,
};

RequestModel.sync(options).then(() => {
  logger.info("Requests table migrated");
  // Table created
});
