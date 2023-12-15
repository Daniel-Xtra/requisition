import crypto from "crypto";
import slugify from "slugify";
import * as generate from "otp-generator";

export const getMomentTimeDiff = async (arr: any) => {
  let datenow = new Date().getTime();
  let expires = new Date(arr);
  let time_diff = datenow - expires.getTime();
  let duration = await Math.round(time_diff / (1000 * 3600 * 24));
  return duration;
};

/**
 * user excludes
 */

export const USER_EXCLUDES = [
  "email",
  "phone_number",
  "password",

  "date_of_birth",
  "email_verification_code",
  "reset_password_code",
  "refresh_token",

  "updated_at",
  "deleted_at",
];

/**
 * profile excludes
 */

export const GENERAL_EXCLUDES = [
  "created_at",
  "updated_at",
  "deleted_at",
  "userId",
];

/**
 * user excludes for append data
 */

export const USER_EXCLUDES_FOR_APPENDDATA = [
  "email",
  "phone_number",
  "password",
  "first_name",
  "last_name",
  "date_of_birth",
  "email_verification_code",
  "socket_id",

  "updated_at",
  "deleted_at",
  "userId",
];

export const USER_INCLUDES = [
  "id",
  "username",
  "email",
  "phone_number",
  "first_name",
  "last_name",
  "gender",
  "date_of_birth",
];

export const createSlug = (str: string) => {
  let newString = slugify(str, {
    remove: /[*+~.()'"!?:/@#${}<>,]/g,
    lower: true,
  });
  // create random slug
  const random = crypto.randomBytes(6).toString("hex");
  newString = `${newString}-${random}`;

  return newString;
};

export const generateUniqueIdentifier = () => {
  return crypto.randomBytes(4).toString("hex");
};

export const getPagination = (page, per_page) => {
  const limit = per_page ? +per_page : 3;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

export const getPagingData = (data, page, limit) => {
  const count = data.count;
  const list = data.rows;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(count / limit);
  return { count, list, totalPages, currentPage };
};

export const generateOTP = () => {
  const otp = generate.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

export const AddMinutesToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};
