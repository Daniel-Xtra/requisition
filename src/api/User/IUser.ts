import { IBaseInterface } from "../baseInterface";

export interface IUser extends IBaseInterface {
    // type any is used to prevent error on validation level
    username: any;
    first_name: any;
    last_name: any;
    email: any;
    password: any;
    phone_number: any;
    gender: any;
    membership_type: any;
    date_of_birth: any;
    email_verification_code: any;
}
