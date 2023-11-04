import { IBaseInterface } from "../baseInterface";

export interface IUser extends IBaseInterface {
  // type any is used to prevent error on validation level

  first_name: any;
  last_name: any;
  email: any;
  password: any;
  phone_number: any;
  gender: any;
  membership_type: any;
  current_position: any;
  email_verification_code: any;
}
