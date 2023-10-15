import express from "express";
import { AuthRouter } from "./api/Auth";

import { ProfileRouter } from "./api/Profile";

import { UserRouter } from "./api/User";

import { BASE_PATH } from "./config";
import { errorHandler, global } from "./middleware";
import { DB } from "./shared/database";
import { logger } from "./utils/logger";
import * as Sentry from "@sentry/node";
import { AdminRouter } from "./api/Admin/adminRouter";

import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger/swagger.json";

class App {
  public express = express();
  public basePath = BASE_PATH || "";
  constructor() {
    this.boot();
  }

  private boot() {
    this.initilizeDb();
    this.registerMiddlewares();

    this.mountRoutes();
    this.handleUncaughtErrorEvents();
  }

  private mountRoutes() {
    this.express.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    this.express.use(`${this.basePath}/auth`, AuthRouter);
    this.express.use(`${this.basePath}/users`, UserRouter);
    this.express.use(`${this.basePath}/profiles`, ProfileRouter);
    this.express.use(`${this.basePath}/admin`, AdminRouter);
  }

  private registerMiddlewares() {
    global(this.express);
  }

  private initilizeDb() {
    DB.authenticate()
      .then(() => {
        logger.info("Database connection has been established successfully.");
      })
      .catch((err) => {
        throw err;
      });
  }

  // Error handlers
  private handleUncaughtErrorEvents() {
    this.express.use(Sentry.Handlers.errorHandler());
    process.on("unhandledRejection", (reason, promise) => {
      throw reason;
    });

    process.on("uncaughtException", (error) => {
      logger.error(
        `Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`
      );
      DB.close();
      process.exit(1);
    });

    process.on("SIGINT", () => {
      logger.info(" Alright! Bye bye!");
      DB.close();
      process.exit();
    });

    this.express.use(errorHandler);
  }
}

export default new App().express;
