import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";

//import { ALTER_STATE } from "../../config";
import { DivisionModel } from "../Division";

export class UserModel extends Model {}
UserModel.init(
  {
    email: {
      type: Sequelize.STRING(50),
      unique: {
        name: "email",
        msg: "An account already exists with this email address.",
      },
      validate: {
        isEmail: { msg: "Please check this is a valid email" },
        notEmpty: { msg: "email can't be empty" },
      },
    },
    phone_number: {
      type: Sequelize.STRING(20),
      validate: {
        isNumeric: {
          msg: "Please confirm phonenumber contains valid characters",
        },
      },
    },
    password: {
      type: Sequelize.STRING(191),
    },
    first_name: {
      type: Sequelize.STRING(10),
      validate: {
        min: 2,
      },
    },
    last_name: {
      type: Sequelize.STRING(50),
      validate: {
        min: 2,
      },
    },
    gender: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    membership_type: {
      type: Sequelize.ENUM({
        values: ["staff", "store", "ict", "admin"],
      }),
      defaultValue: "staff",
    },
    email_verification_code: {
      type: Sequelize.STRING(150),
      unique: {
        name: "email_verification_code",
        msg: "Duplicate email_verification_code",
      },
    },
    password_reset_code: {
      type: Sequelize.STRING(6),
      unique: {
        name: "password_reset_code",
        msg: "Duplicate password reset code",
      },
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    player_id: {
      type: Sequelize.STRING(50),
    },
    pass_updated: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },

    refresh_token: {
      type: Sequelize.STRING(150),
      unique: {
        name: "refresh_token",
        msg: "Duplicate refresh token",
      },
      allowNull: true,
    },
  },
  {
    sequelize: DB,
    modelName: "users",
  }
);

//const options: any = { alter: ALTER_STATE };

UserModel.belongsTo(DivisionModel);
DivisionModel.hasMany(UserModel);

// force: true will drop the table if it already exists
UserModel.sync().then(() => {
  logger.info("Users table migrated");
  // Table created
});
