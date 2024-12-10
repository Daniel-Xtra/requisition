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
  division: any;
  email_verification_code: any;
}

export interface IPassword extends IBaseInterface {
  old_password: any;
  new_password: any;
}
