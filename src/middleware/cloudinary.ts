const cloudinary = require("cloudinary").v2;
import { API_KEY, CLOUD_NAME, API_SECRET } from "../config/index";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

module.exports = { cloudinary };
