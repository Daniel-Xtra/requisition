import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
// import { ALTER_STATE } from "../../config";

export class DivisionModel extends Model {}
DivisionModel.init(
  {
    name: {
      type: Sequelize.STRING(120),
    },
    slug: {
      type: Sequelize.STRING(120),
      unique: {
        name: "slug",
        msg: "Duplicate slug",
      },

      allowNull: false,
      validate: {
        notNull: {
          msg: "This division needs a slug",
        },
      },
    },
    abbreviation: {
      type: Sequelize.STRING,
      unique: { name: "abbreviation", msg: "Duplicate abbreviation" },
    },
  },
  {
    sequelize: DB,
    modelName: "divisions",
  }
);

// const options: any = {
//   alter: ALTER_STATE,
// };

// force: true will drop the table if it already exists
DivisionModel.sync().then(() => {
  logger.info("Divisions table migrated");
  // Table created
});
