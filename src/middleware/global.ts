import bodyParser = require("body-parser");
import cors = require("cors");
import { Express } from "express";
import logger from "morgan";
import passport from "passport";
import { jwtStrategy } from "./passport";
import express = require("express");
//import path from "path";

export default (app: Express) => {
  app.use(cors({ maxAge: 1728000 }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logger("dev"));

  // app.use(express.static("src/views/imgs"));
  app.use("/photo", express.static("public/categories"));
  passport.use(jwtStrategy);
};
