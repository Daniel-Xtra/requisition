import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const PORT2 = process.env.PORT2;
export const ENVIRONMENT = process.env.NODE_ENV;
export const APP_URL = process.env.APP_URL;
export const STORE_URL = process.env.STORE_URL;
export const BASE_PATH = process.env.BASE_PATH;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_SECRET_REFRESHTOKEN = process.env.JWT_SECRET_REFRESHTOKEN;
export const ALTER_STATE = process.env.ALTER_STATE;

export const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
