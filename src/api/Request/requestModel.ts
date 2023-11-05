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
      validate: {
        notNull: {
          msg: "This is a required field",
        },
      },
    },
    unique_id: {
      type: Sequelize.STRING(100),
      unique: {
        name: "unique_id",
        msg: "Duplicate unique_id",
      },
      allowNull: false,
    },
    qty_required: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "This is a required field",
        },
      },
    },

    purpose: {
      type: Sequelize.STRING,
      allowNull: true,
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
      allowNull: true,
    },
    approved_by: {
      type: Sequelize.INTEGER,
    },
    date_approved: {
      type: Sequelize.DATE,
    },
    qty_issued: {
      type: Sequelize.INTEGER,
    },
    issued_by: {
      type: Sequelize.INTEGER,
    },
    date_issued: {
      type: Sequelize.DATE,
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
