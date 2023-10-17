import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import { ALTER_STATE } from "../../config";
import { UserModel } from "../User";

export class ProfileModel extends Model {}
ProfileModel.init(
  {
    profile_picture_url: {
      type: Sequelize.STRING(120),
    },
    current_position: {
      type: Sequelize.STRING(120),
    },
  },
  {
    sequelize: DB,
    modelName: "profiles",
  }
);

const options: any = {
  alter: ALTER_STATE,
};

UserModel.hasOne(ProfileModel);
ProfileModel.belongsTo(UserModel);

// force: true will drop the table if it already exists
ProfileModel.sync(options).then(() => {
  logger.info("Profiles table migrated");
  // Table created
});
