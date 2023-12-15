import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import withCursor from "sequelize-cursor-pagination";
import { ALTER_STATE } from "../../config";
import { UserModel } from "../User";

export class UserConnectionsModel extends Model {}
UserConnectionsModel.init(
  {
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    socket_id: {
      type: Sequelize.STRING(50),
    },
  },
  {
    sequelize: DB,
    modelName: "user_connections",
  }
);

const syncOption: any = {
  alter: ALTER_STATE,
};

const paginationOptions: any = {
  methodName: "paginate",
  primaryKeyField: "id",
};

UserModel.hasMany(UserConnectionsModel);
UserConnectionsModel.belongsTo(UserModel);

// force: true will drop the table if it already exists
UserConnectionsModel.sync(syncOption).then(() => {
  logger.info("User connections table migrated");
  // Table created
});

withCursor(paginationOptions)(<any>UserConnectionsModel);
