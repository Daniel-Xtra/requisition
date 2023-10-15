import app from "./app";

import { Server } from "http";
import { PORT } from "./config";
import { logger } from "./utils/logger";

const port = PORT || 3000;

const httpServer = new Server(app);

httpServer.listen(PORT, (err) => {
  if (err) {
    return logger.error(err);
  }

  return logger.info(`http Server is listening on port: ${port}`);
});
