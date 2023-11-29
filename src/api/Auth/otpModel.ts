import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import { ALTER_STATE } from "../../config";
import { UserModel } from "../User";

export class OTPModel extends Model {}
OTPModel.init(
  {
    otp: {
      type: Sequelize.STRING,
      unique: {
        name: "email_verification_code",
        msg: "Duplicate email_verification_code",
      },
    },
    expiration_time: {
      type: Sequelize.DATE,
    },

    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
  },
  { sequelize: DB, modelName: "otps" }
);
const options: any = {
  alter: ALTER_STATE,
};

UserModel.hasMany(OTPModel);
OTPModel.belongsTo(UserModel);

OTPModel.sync(options).then(() => {
  logger.info("OTPS table migrated");
});
