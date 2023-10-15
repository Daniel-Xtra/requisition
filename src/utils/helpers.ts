export const getMomentTimeDiff = async (arr: any) => {
  let datenow = new Date().getTime();
  let expires = new Date(arr);
  let time_diff = datenow - expires.getTime();
  let duration = await Math.round(time_diff / (1000 * 3600 * 24));
  return duration;
};

/**
 * get moment time
 * @param arr
 */

/**
 * user excludes
 */

export const USER_EXCLUDES = [
  "email",
  "phone_number",
  "password",
  "first_name",
  "last_name",
  "date_of_birth",
  "email_verification_code",
  "reset_password_code",
  "refresh_token",
  "auth_key",
  "updated_at",
  "deleted_at",
];

/**
 * profile excludes
 */

export const PROFILE_EXCLUDES = [
  "relationship_status",
  "occupation",
  "highest_education",
  "current_education",
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
  "auth_key",
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
