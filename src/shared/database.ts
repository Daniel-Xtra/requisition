import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from "../config";
export const DB = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
  typeValidation: true,
  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: true,
    decimalNumbers: true,
  },
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
    underscored: true,
  },
  pool: {
    max: 100,
    min: 0,
    acquire: 600000,
    idle: 10000,
    evict: 60000,
  },
  retry: {
    match: [/Deadlock/i],
    max: 7, // Maximum rety 3 times
  },
});
